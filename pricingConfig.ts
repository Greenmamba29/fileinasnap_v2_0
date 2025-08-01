/**
 * FileInASnap Pricing Configuration
 * 
 * This modular pricing system allows easy A/B testing of price points,
 * feature flags, and tier names. Update this file to modify pricing
 * without touching core application logic.
 */

export type PlanName = 'standard' | 'pro' | 'veteran' | 'enterprise' | 'creator';

export interface AIModelConfig {
  /** Primary AI model for this tier */
  primaryModel: 'gpt-4' | 'gpt-3.5-turbo' | 'gemini-pro' | 'claude-3-sonnet' | 'claude-3-opus';
  /** Fallback model if primary fails */
  fallbackModel?: 'gpt-3.5-turbo' | 'gemini-pro';
  /** Maximum API calls per month */
  maxApiCalls: number;
}

export interface PlanFeatures {
  // Core Features
  fileIntelligence: boolean;
  smartFolderRouting: boolean;
  
  // Content Features  
  journaling: boolean;
  memoryTimeline: boolean;
  documentParsing: boolean;
  
  // AI Features
  relationshipMapping: boolean;
  faceRecognition: boolean;
  storyGeneration: boolean;
  
  // Advanced Features
  workflowManagement: boolean;
  overrideUI: boolean;
  adminDashboard: boolean;
  fallbackAnalytics: boolean;
  apiExport: boolean;
  
  // Support Features
  premiumSupport: boolean;
  customIntegrations: boolean;
}

export interface PlanLimits {
  maxStorageGB: number;
  maxMonthlyUploads: number;
  maxUsers: number;
  maxWorkflows: number;
  apiRateLimit: number; // requests per minute
}

export interface PricingTier {
  id: PlanName;
  name: string;
  description: string;
  tagline: string;
  pricePerMonth: number;
  pricePerYear: number; // Usually ~10 months pricing
  popular?: boolean;
  features: PlanFeatures;
  limits: PlanLimits;
  aiConfig: AIModelConfig;
  /** Marketing copy for feature highlights */
  highlights: string[];
  /** Call-to-action button text */
  ctaText: string;
}

/**
 * A/B Testing Configuration
 * Toggle between different pricing experiments
 */
export interface PricingExperiment {
  id: string;
  name: string;
  description: string;
  active: boolean;
  tiers: PricingTier[];
}

// Default Pricing Configuration
export const DEFAULT_PRICING: PricingTier[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Perfect for individuals getting started with AI file organization',
    tagline: 'Smart Organization Made Simple',
    pricePerMonth: 9,
    pricePerYear: 90,
    features: {
      fileIntelligence: true,
      smartFolderRouting: true,
      journaling: false,
      memoryTimeline: false,
      documentParsing: false,
      relationshipMapping: false,
      faceRecognition: false,
      storyGeneration: false,
      workflowManagement: false,
      overrideUI: false,
      adminDashboard: false,
      fallbackAnalytics: false,
      apiExport: false,
      premiumSupport: false,
      customIntegrations: false,
    },
    limits: {
      maxStorageGB: 5,
      maxMonthlyUploads: 200,
      maxUsers: 1,
      maxWorkflows: 0,
      apiRateLimit: 10,
    },
    aiConfig: {
      primaryModel: 'gpt-3.5-turbo',
      fallbackModel: 'gemini-pro',
      maxApiCalls: 1000,
    },
    highlights: [
      'AI-powered file renaming',
      'Smart folder organization',
      'Basic tagging system',
      '5GB cloud storage'
    ],
    ctaText: 'Start Organizing',
  },
  
  {
    id: 'pro',  
    name: 'Pro',
    description: 'For creators who want to capture and organize their memories',
    tagline: 'Capture Every Memory',
    pricePerMonth: 19,
    pricePerYear: 190,
    popular: true,
    features: {
      fileIntelligence: true,
      smartFolderRouting: true,
      journaling: true,
      memoryTimeline: true,
      documentParsing: true,
      relationshipMapping: false,
      faceRecognition: false,
      storyGeneration: false,
      workflowManagement: false,
      overrideUI: false,
      adminDashboard: false,
      fallbackAnalytics: false,
      apiExport: false,
      premiumSupport: false,
      customIntegrations: false,
    },
    limits: {
      maxStorageGB: 25,
      maxMonthlyUploads: 1000,
      maxUsers: 3,
      maxWorkflows: 5,
      apiRateLimit: 30,
    },
    aiConfig: {
      primaryModel: 'gpt-4',
      fallbackModel: 'gemini-pro',
      maxApiCalls: 5000,
    },
    highlights: [
      'Everything in Standard',
      'AI journal analysis',
      'Memory timeline view',
      'Document text extraction',
      'GPT-4 powered insights'
    ],
    ctaText: 'Upgrade to Pro',
  },
  
  {
    id: 'veteran',
    name: 'Veteran', 
    description: 'Complete workflow management with advanced AI capabilities',
    tagline: 'Master Your Digital Life',
    pricePerMonth: 49,
    pricePerYear: 490,
    features: {
      fileIntelligence: true,
      smartFolderRouting: true,
      journaling: true,
      memoryTimeline: true,
      documentParsing: true,
      relationshipMapping: true,
      faceRecognition: true,
      storyGeneration: true,
      workflowManagement: true,
      overrideUI: true,
      adminDashboard: false,
      fallbackAnalytics: false,
      apiExport: false,
      premiumSupport: false,
      customIntegrations: false,
    },
    limits: {
      maxStorageGB: 100,
      maxMonthlyUploads: 5000,
      maxUsers: 10,
      maxWorkflows: 25,
      apiRateLimit: 100,
    },
    aiConfig: {
      primaryModel: 'claude-3-sonnet',
      fallbackModel: 'gpt-4',
      maxApiCalls: 15000,
    },
    highlights: [
      'Everything in Pro',
      'Face recognition & relationships',
      'AI story generation',
      'Custom workflow automation',
      'Advanced UI controls',
      'Claude AI integration'
    ],
    ctaText: 'Go Veteran',
  },
  
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations requiring full control and analytics',
    tagline: 'Enterprise-Grade Intelligence',
    pricePerMonth: 149,  
    pricePerYear: 1490,
    features: {
      fileIntelligence: true,
      smartFolderRouting: true,
      journaling: true,
      memoryTimeline: true,
      documentParsing: true,
      relationshipMapping: true,
      faceRecognition: true,
      storyGeneration: true,
      workflowManagement: true,
      overrideUI: true,
      adminDashboard: true,
      fallbackAnalytics: true,
      apiExport: true,
      premiumSupport: true,
      customIntegrations: true,
    },
    limits: {
      maxStorageGB: Infinity,
      maxMonthlyUploads: Infinity,
      maxUsers: Infinity,
      maxWorkflows: Infinity,
      apiRateLimit: 1000,
    },
    aiConfig: {
      primaryModel: 'claude-3-opus',
      fallbackModel: 'claude-3-sonnet',
      maxApiCalls: Infinity,
    },
    highlights: [
      'Everything in Veteran',
      'Admin dashboard & analytics',
      'API export capabilities',
      'Priority support',
      'Custom integrations',
      'Unlimited everything'
    ],
    ctaText: 'Contact Sales',
  }
];

// A/B Testing Experiments
export const PRICING_EXPERIMENTS: PricingExperiment[] = [
  {
    id: 'default',
    name: 'Default Pricing',
    description: 'Standard pricing tiers',
    active: true,
    tiers: DEFAULT_PRICING,
  },
  
  {
    id: 'creator-focused',
    name: 'Creator-Focused Pricing',
    description: 'Lower prices targeting content creators',
    active: false,
    tiers: DEFAULT_PRICING.map(tier => ({
      ...tier,
      pricePerMonth: Math.floor(tier.pricePerMonth * 0.8), // 20% discount
      pricePerYear: Math.floor(tier.pricePerYear * 0.8),
    })),
  },
  
  {
    id: 'power-user',
    name: 'Power User Pricing', 
    description: 'Higher prices with premium positioning',
    active: false,
    tiers: DEFAULT_PRICING.map(tier => ({
      ...tier,
      pricePerMonth: Math.floor(tier.pricePerMonth * 1.3), // 30% increase
      pricePerYear: Math.floor(tier.pricePerYear * 1.3),
    })),
  }
];

/**
 * Get active pricing configuration
 */
export function getActivePricing(): PricingTier[] {
  const activeExperiment = PRICING_EXPERIMENTS.find(exp => exp.active);
  return activeExperiment?.tiers || DEFAULT_PRICING;
}

/**
 * Get specific pricing tier
 */
export function getPricingTier(planName: PlanName): PricingTier {
  const pricing = getActivePricing();
  const tier = pricing.find(t => t.id === planName);
  if (!tier) {
    throw new Error(`Unknown pricing tier: ${planName}`);
  }
  return tier;
}

/**
 * Check if feature is available for plan
 */
export function hasFeature(planName: PlanName, feature: keyof PlanFeatures): boolean {
  const tier = getPricingTier(planName);
  return tier.features[feature];
}

/**
 * Get AI model configuration for plan
 */
export function getAIConfig(planName: PlanName): AIModelConfig {
  const tier = getPricingTier(planName);
  return tier.aiConfig;
}