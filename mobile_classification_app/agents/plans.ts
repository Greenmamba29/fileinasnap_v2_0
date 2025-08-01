/**
 * Legacy Plans Configuration - Maintained for Backward Compatibility
 * 
 * This module provides the original plan definitions for agents that haven't
 * been updated to use the new modular pricing system. It now imports from
 * the centralized pricingConfig.ts to maintain consistency.
 * 
 * @deprecated Use pricingConfig.ts for new implementations
 */

import { 
  PlanName as ModernPlanName, 
  PricingTier,
  getActivePricing,
  hasFeature as modernHasFeature
} from '../../pricingConfig';

// Legacy type exports for backward compatibility
export type PlanName = ModernPlanName;

// Legacy interface mappings
export interface PlanFeatures {
  /** Core file intelligence including renaming, tagging and routing */
  fileIntelligence: boolean;
  /** Journaling and memory therapy tools */
  journaling: boolean;
  /** Relationship and face recognition */
  relationship: boolean;
  /** Story modules such as Seasonal Chronicles and Relationship Journeys */
  storyModules: boolean;
  /** Access to advanced analytics and admin dashboards */
  analytics: boolean;
  /** Premium support and custom integrations */
  premiumSupport: boolean;
}

export interface PlanLimits {
  /** Maximum storage quota in megabytes */
  maxStorageMb: number;
  /** Maximum number of file uploads per month */
  maxMonthlyUploads: number;
  /** Maximum number of users allowed in an organization */
  maxUsers: number;
}

export interface PlanDefinition {
  name: PlanName;
  features: PlanFeatures;
  limits: PlanLimits;
  /** Human friendly description for marketing pages */
  description: string;
  /** Monthly price in USD (0 for free plans) */
  pricePerMonth: number;
}

/**
 * Convert modern pricing tiers to legacy plan definitions
 */
function convertToLegacyFormat(tier: PricingTier): PlanDefinition {
  return {
    name: tier.id,
    features: {
      fileIntelligence: tier.features.fileIntelligence,
      journaling: tier.features.journaling,
      relationship: tier.features.relationshipMapping,
      storyModules: tier.features.storyGeneration,
      analytics: tier.features.fallbackAnalytics,
      premiumSupport: tier.features.premiumSupport,
    },
    limits: {
      maxStorageMb: tier.limits.maxStorageGB * 1024, // Convert GB to MB
      maxMonthlyUploads: tier.limits.maxMonthlyUploads,
      maxUsers: tier.limits.maxUsers,
    },
    description: tier.description,
    pricePerMonth: tier.pricePerMonth,
  };
}

/**
 * Legacy PLANS export - dynamically generated from modern pricing config
 * This ensures consistency while maintaining backward compatibility
 */
export const PLANS: Record<PlanName, PlanDefinition> = (() => {
  const modernPricing = getActivePricing();
  const legacyPlans: Record<PlanName, PlanDefinition> = {} as any;
  
  modernPricing.forEach(tier => {
    legacyPlans[tier.id] = convertToLegacyFormat(tier);
  });
  
  return legacyPlans;
})();

/**
 * Legacy helper function - delegates to modern implementation
 */
export function hasFeature(planName: PlanName, feature: keyof PlanFeatures): boolean {
  // Map legacy feature names to modern feature names
  const featureMapping: Record<keyof PlanFeatures, string> = {
    fileIntelligence: 'fileIntelligence',
    journaling: 'journaling',
    relationship: 'relationshipMapping',
    storyModules: 'storyGeneration',
    analytics: 'fallbackAnalytics',
    premiumSupport: 'premiumSupport',
  };
  
  const modernFeatureName = featureMapping[feature];
  return modernHasFeature(planName, modernFeatureName as any);
}