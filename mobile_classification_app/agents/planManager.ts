/**
 * Enhanced PlanManager with integration to the new modular pricing system.
 * Centralizes subscription plan lookup, feature gating, and AI model configuration.
 */

import { 
  PlanName, 
  PricingTier, 
  PlanFeatures, 
  PlanLimits,
  AIModelConfig,
  getActivePricing, 
  getPricingTier, 
  hasFeature,
  getAIConfig 
} from '../../pricingConfig';

/**
 * Retrieve a plan definition by its name using the active pricing configuration.
 * This function now integrates with the A/B testing pricing system.
 */
export function getPlan(planName: PlanName): PricingTier {
  try {
    return getPricingTier(planName);
  } catch (error) {
    throw new Error(`Unknown plan: ${planName}. Available plans: ${getAvailablePlans().join(', ')}`);
  }
}

/**
 * Get all available plan names from the active pricing configuration.
 */
export function getAvailablePlans(): PlanName[] {
  const activePricing = getActivePricing();
  return activePricing.map(tier => tier.id);
}

/**
 * Determine whether a given feature is enabled for a plan.
 * This now uses the modular pricing configuration system.
 *
 * @param planName - The name of the current subscription plan.
 * @param feature - The feature being requested.
 */
export function isFeatureEnabled(
  planName: PlanName,
  feature: keyof PlanFeatures,
): boolean {
  return hasFeature(planName, feature);
}

/**
 * Get the AI model configuration for a specific plan.
 * Includes primary model, fallback model, and usage limits.
 *
 * @param planName - The subscription plan name.
 */
export function getAIModelConfig(planName: PlanName): AIModelConfig {
  return getAIConfig(planName);
}

/**
 * Check whether an organization has capacity to perform an action based on its limits.
 * Each agent can call this before starting a resource‑intensive operation.
 *
 * @param planName - The organization's subscription plan.
 * @param type - The type of action (e.g. 'upload', 'storage').
 * @param currentValue - The current usage for the given action.
 * @param increment - The amount of usage to add.
 */
export function checkQuota(
  planName: PlanName,
  type: 'storage' | 'uploads' | 'users' | 'workflows' | 'apiCalls',
  currentValue: number,
  increment: number = 1,
): boolean {
  const plan = getPlan(planName);
  
  switch (type) {
    case 'storage':
      return currentValue + increment <= plan.limits.maxStorageGB * 1024; // Convert GB to MB
    case 'uploads':
      return currentValue + increment <= plan.limits.maxMonthlyUploads;
    case 'users':
      return currentValue + increment <= plan.limits.maxUsers;
    case 'workflows':
      return currentValue + increment <= plan.limits.maxWorkflows;
    case 'apiCalls':
      return currentValue + increment <= plan.aiConfig.maxApiCalls;
    default:
      return false;
  }
}

/**
 * Get human-readable plan information for UI display.
 */
export function getPlanDisplayInfo(planName: PlanName) {
  const plan = getPlan(planName);
  
  return {
    name: plan.name,
    displayName: plan.name.charAt(0).toUpperCase() + plan.name.slice(1),
    description: plan.description,
    tagline: plan.tagline,
    pricePerMonth: plan.pricePerMonth,
    pricePerYear: plan.pricePerYear,
    popular: plan.popular || false,
    highlights: plan.highlights,
    ctaText: plan.ctaText,
  };
}

/**
 * Get plan limits in a formatted, human-readable way.
 */
export function getFormattedLimits(planName: PlanName) {
  const plan = getPlan(planName);
  const limits = plan.limits;
  
  return {
    storage: limits.maxStorageGB === Infinity 
      ? 'Unlimited' 
      : `${limits.maxStorageGB} GB`,
    uploads: limits.maxMonthlyUploads === Infinity 
      ? 'Unlimited' 
      : `${limits.maxMonthlyUploads.toLocaleString()} per month`,
    users: limits.maxUsers === Infinity 
      ? 'Unlimited' 
      : `${limits.maxUsers} users`,
    workflows: limits.maxWorkflows === Infinity 
      ? 'Unlimited' 
      : `${limits.maxWorkflows} workflows`,
    apiCalls: plan.aiConfig.maxApiCalls === Infinity 
      ? 'Unlimited' 
      : `${plan.aiConfig.maxApiCalls.toLocaleString()} AI calls/month`,
  };
}

/**
 * Check if a plan upgrade is required for a specific feature.
 * Returns the minimum plan required or null if feature is available.
 */
export function getRequiredPlanForFeature(feature: keyof PlanFeatures): PlanName | null {
  const allPlans = getActivePricing();
  
  for (const plan of allPlans) {
    if (plan.features[feature]) {
      return plan.id;
    }
  }
  
  return null; // Feature not available in any plan
}

/**
 * Get upgrade suggestions based on current plan and desired features.
 */
export function getUpgradeSuggestions(
  currentPlan: PlanName, 
  desiredFeatures: Array<keyof PlanFeatures>
): {
  suggestedPlan: PlanName | null;
  newFeatures: Array<keyof PlanFeatures>;
  priceIncrease: number;
} {
  const allPlans = getActivePricing();
  const currentPlanIndex = allPlans.findIndex(p => p.id === currentPlan);
  
  if (currentPlanIndex === -1) {
    throw new Error(`Current plan ${currentPlan} not found`);
  }
  
  // Find the minimum plan that supports all desired features
  for (let i = currentPlanIndex + 1; i < allPlans.length; i++) {
    const plan = allPlans[i];
    const supportsAllFeatures = desiredFeatures.every(feature => plan.features[feature]);
    
    if (supportsAllFeatures) {
      const currentPrice = allPlans[currentPlanIndex].pricePerMonth;
      const newPrice = plan.pricePerMonth;
      const newFeatures = desiredFeatures.filter(feature => 
        !allPlans[currentPlanIndex].features[feature]
      );
      
      return {
        suggestedPlan: plan.id,
        newFeatures,
        priceIncrease: newPrice - currentPrice,
      };
    }
  }
  
  return {
    suggestedPlan: null,
    newFeatures: [],
    priceIncrease: 0,
  };
}

/**
 * Validate that a plan configuration is valid and consistent.
 * Useful for testing new pricing configurations.
 */
export function validatePlanConfiguration(planName: PlanName): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  try {
    const plan = getPlan(planName);
    
    // Check pricing consistency
    if (plan.pricePerMonth < 0) {
      errors.push('Price per month cannot be negative');
    }
    
    if (plan.pricePerYear < plan.pricePerMonth * 10) {
      errors.push('Annual pricing should offer at least 2 months free');
    }
    
    // Check feature logic
    const features = plan.features;
    if (features.storyGeneration && !features.journaling) {
      errors.push('Story generation requires journaling feature');
    }
    
    if (features.relationshipMapping && !features.faceRecognition) {
      errors.push('Relationship mapping requires face recognition');
    }
    
    if (features.fallbackAnalytics && !features.analytics) {
      errors.push('Fallback analytics requires basic analytics');
    }
    
    // Check limits consistency
    const limits = plan.limits;
    if (limits.maxStorageGB < 1 && limits.maxStorageGB !== Infinity) {
      errors.push('Storage limit must be at least 1GB or unlimited');
    }
    
    if (limits.maxMonthlyUploads < 10 && limits.maxMonthlyUploads !== Infinity) {
      errors.push('Upload limit must be at least 10 per month or unlimited');
    }
    
    // Check AI configuration
    const aiConfig = plan.aiConfig;
    if (aiConfig.maxApiCalls < 100 && aiConfig.maxApiCalls !== Infinity) {
      errors.push('API call limit must be at least 100 or unlimited');
    }
    
  } catch (error) {
    errors.push(`Failed to load plan: ${error}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Export enhanced plan manager functions for backward compatibility
 * with existing agent code.
 */
export {
  // Re-export from pricing config for convenience
  hasFeature as isFeatureAvailable,
  getAIConfig as getModelConfig,
  getPricingTier as getPlanConfiguration,
};

/**
 * Agent-specific helper to validate plan access before processing.
 * This should be called at the start of every agent function.
 */
export function validateAgentAccess(
  planName: PlanName,
  requiredFeature: keyof PlanFeatures,
  agentName: string
): void {
  if (!isFeatureEnabled(planName, requiredFeature)) {
    const requiredPlan = getRequiredPlanForFeature(requiredFeature);
    throw new Error(
      `${agentName} requires ${requiredFeature} feature. ` +
      `Current plan: ${planName}. Required plan: ${requiredPlan || 'Enterprise'}.`
    );
  }
}