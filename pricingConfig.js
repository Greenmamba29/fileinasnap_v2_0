/**
 * FileInASnap Pricing Configuration
 *
 * This modular pricing system allows easy A/B testing of price points,
 * feature flags, and tier names. Update this file to modify pricing
 * without touching core application logic.
 */
// Updated Pricing Configuration based on new structure
export const DEFAULT_PRICING = [
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
            smartFolderCreation: false,
            journaling: 'readonly',
            memoryTimeline: false,
            documentParsing: true,
            voiceAssistant: false,
            videoCaptioning: false,
            audioSupport: false,
            relationshipMapping: false,
            faceRecognition: false,
            storyGeneration: false,
            peopleTracing: false,
            memoryFilters: false,
            workflowManagement: false,
            adminOverride: false,
            agentFeedback: false,
            adminDashboard: false,
            auditTrail: false,
            fallbackAnalytics: false,
            apiExport: false,
            collaborationFolders: false,
            bulkUserOnboarding: false,
            premiumSupport: false,
            customSLAs: false,
            dedicatedSupport: false,
        },
        limits: {
            maxStorageGB: 5,
            maxMonthlyUploads: 200,
            maxUsers: 1,
            maxWorkflows: 0,
            apiRateLimit: 10,
            maxVoiceMinutes: 0,
            maxVideoMinutes: 0,
        },
        aiConfig: {
            primaryModel: 'groq-llama3',
            fallbackModel: 'gemini-1.5-pro',
            maxApiCalls: 1000,
            supportsChaining: false,
        },
        highlights: [
            'File upload + Smart Folder routing',
            'Auto-tagging + scoring',
            'GROQ-powered AI agents',
            'Limited journaling (read-only)'
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
            smartFolderCreation: true,
            journaling: 'full',
            memoryTimeline: true,
            documentParsing: true,
            voiceAssistant: false,
            videoCaptioning: false,
            audioSupport: false,
            relationshipMapping: false,
            faceRecognition: false,
            storyGeneration: false,
            peopleTracing: true,
            memoryFilters: true,
            workflowManagement: false,
            adminOverride: true,
            agentFeedback: false,
            adminDashboard: false,
            auditTrail: false,
            fallbackAnalytics: false,
            apiExport: false,
            collaborationFolders: false,
            bulkUserOnboarding: false,
            premiumSupport: false,
            customSLAs: false,
            dedicatedSupport: false,
        },
        limits: {
            maxStorageGB: 25,
            maxMonthlyUploads: 1000,
            maxUsers: 3,
            maxWorkflows: 5,
            apiRateLimit: 30,
            maxVoiceMinutes: 0,
            maxVideoMinutes: 0,
        },
        aiConfig: {
            primaryModel: 'gemini-1.5-pro',
            fallbackModel: 'gpt-4',
            maxApiCalls: 5000,
            supportsChaining: false,
        },
        highlights: [
            'All Standard features',
            'Full Journaling + Memory Timeline',
            'Gemini 1.5 agents',
            'Smart Folder creation + override',
            'People tracing + memory filters'
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
            smartFolderCreation: true,
            journaling: 'full',
            memoryTimeline: true,
            documentParsing: true,
            voiceAssistant: true,
            videoCaptioning: false,
            audioSupport: true,
            relationshipMapping: true,
            faceRecognition: true,
            storyGeneration: true,
            peopleTracing: true,
            memoryFilters: true,
            workflowManagement: true,
            adminOverride: true,
            agentFeedback: true,
            adminDashboard: false,
            auditTrail: false,
            fallbackAnalytics: false,
            apiExport: true,
            collaborationFolders: true,
            bulkUserOnboarding: false,
            premiumSupport: false,
            customSLAs: false,
            dedicatedSupport: false,
        },
        limits: {
            maxStorageGB: 100,
            maxMonthlyUploads: 5000,
            maxUsers: 10,
            maxWorkflows: 25,
            apiRateLimit: 100,
            maxVoiceMinutes: 500,
            maxVideoMinutes: 0,
        },
        aiConfig: {
            primaryModel: 'claude-3-sonnet',
            fallbackModel: 'gpt-4',
            maxApiCalls: 15000,
            supportsChaining: true,
        },
        highlights: [
            'All Pro features',
            'Claude 3 agent chains',
            'Voice assistant journaling',
            'Admin override + agent feedback',
            'API export + collaboration folders'
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
            smartFolderCreation: true,
            journaling: 'full',
            memoryTimeline: true,
            documentParsing: true,
            voiceAssistant: true,
            videoCaptioning: true,
            audioSupport: true,
            relationshipMapping: true,
            faceRecognition: true,
            storyGeneration: true,
            peopleTracing: true,
            memoryFilters: true,
            workflowManagement: true,
            adminOverride: true,
            agentFeedback: true,
            adminDashboard: true,
            auditTrail: true,
            fallbackAnalytics: true,
            apiExport: true,
            collaborationFolders: true,
            bulkUserOnboarding: true,
            premiumSupport: true,
            customSLAs: true,
            dedicatedSupport: true,
        },
        limits: {
            maxStorageGB: Infinity,
            maxMonthlyUploads: Infinity,
            maxUsers: Infinity,
            maxWorkflows: Infinity,
            apiRateLimit: 1000,
            maxVoiceMinutes: Infinity,
            maxVideoMinutes: Infinity,
        },
        aiConfig: {
            primaryModel: 'claude-3-opus',
            fallbackModel: 'claude-3-sonnet',
            maxApiCalls: Infinity,
            supportsChaining: true,
        },
        highlights: [
            'All Veteran features',
            'Dedicated admin dashboards',
            'Audit trail + fallback analytics',
            'Bulk org user onboarding',
            'Custom SLAs and support'
        ],
        ctaText: 'Contact Sales',
    },
    {
        id: 'creator',
        name: 'Creator Plan',
        description: 'Specialized for content creators and storytellers',
        tagline: 'Streamlined Memory Storytelling',
        pricePerMonth: 14.99,
        pricePerYear: 149.90,
        onboardingCondition: 'selected_creator = true',
        features: {
            fileIntelligence: true,
            smartFolderRouting: true,
            smartFolderCreation: true,
            journaling: 'full',
            memoryTimeline: true,
            documentParsing: true,
            voiceAssistant: false,
            videoCaptioning: true,
            audioSupport: true,
            relationshipMapping: false,
            faceRecognition: false,
            storyGeneration: true,
            peopleTracing: false,
            memoryFilters: true,
            workflowManagement: false,
            adminOverride: false,
            agentFeedback: false,
            adminDashboard: false,
            auditTrail: false,
            fallbackAnalytics: false,
            apiExport: false,
            collaborationFolders: false,
            bulkUserOnboarding: false,
            premiumSupport: false,
            customSLAs: false,
            dedicatedSupport: false,
        },
        limits: {
            maxStorageGB: 50,
            maxMonthlyUploads: Infinity,
            maxUsers: 1,
            maxWorkflows: 10,
            apiRateLimit: 50,
            maxVoiceMinutes: 100,
            maxVideoMinutes: 200,
        },
        aiConfig: {
            primaryModel: 'gpt-4',
            fallbackModel: 'gemini-1.5-pro',
            maxApiCalls: 8000,
            supportsChaining: false,
        },
        highlights: [
            'Unlimited journaling + tagging',
            'Gemini/GPT-4 content agent access',
            'Video + audio upload support',
            'Auto-captioning and summarization',
            'Streamlined memory storytelling tools'
        ],
        ctaText: 'Create Stories',
    }
];
// A/B Testing Experiments
export const PRICING_EXPERIMENTS = [
    {
        id: 'default',
        name: 'Default Pricing',
        description: 'Standard pricing tiers with Creator plan',
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
            pricePerMonth: tier.id === 'creator' ? tier.pricePerMonth : Math.floor(tier.pricePerMonth * 0.8),
            pricePerYear: tier.id === 'creator' ? tier.pricePerYear : Math.floor(tier.pricePerYear * 0.8),
        })),
    },
    {
        id: 'enterprise-focus',
        name: 'Enterprise Focus Pricing',
        description: 'Higher prices with premium positioning',
        active: false,
        tiers: DEFAULT_PRICING.map(tier => ({
            ...tier,
            pricePerMonth: tier.id === 'creator' ? tier.pricePerMonth : Math.floor(tier.pricePerMonth * 1.2),
            pricePerYear: tier.id === 'creator' ? tier.pricePerYear : Math.floor(tier.pricePerYear * 1.2),
        })),
    }
];
/**
 * Get active pricing configuration
 */
export function getActivePricing() {
    const activeExperiment = PRICING_EXPERIMENTS.find(exp => exp.active);
    return activeExperiment?.tiers || DEFAULT_PRICING;
}
/**
 * Get specific pricing tier
 */
export function getPricingTier(planName) {
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
export function hasFeature(planName, feature) {
    const tier = getPricingTier(planName);
    const featureValue = tier.features[feature];
    // Handle different feature types
    if (typeof featureValue === 'boolean') {
        return featureValue;
    }
    else if (typeof featureValue === 'string') {
        // For features like journaling that have multiple states
        return featureValue !== 'none';
    }
    return false;
}
/**
 * Get specific feature level (for features with multiple states)
 */
export function getFeatureLevel(planName, feature) {
    const tier = getPricingTier(planName);
    return tier.features[feature];
}
/**
 * Get AI model configuration for plan
 */
export function getAIConfig(planName) {
    const tier = getPricingTier(planName);
    return tier.aiConfig;
}
/**
 * Check if plan supports agent chaining
 */
export function supportsAgentChaining(planName) {
    const aiConfig = getAIConfig(planName);
    return aiConfig.supportsChaining;
}
// Legacy support for the old structure
export const PricingConfig = {
    standard: {
        name: 'Standard',
        price: 9,
        features: [
            'File upload + Smart Folder routing',
            'Auto-tagging + scoring',
            'GROQ-powered AI agents',
            'Limited journaling (read-only)'
        ]
    },
    pro: {
        name: 'Pro',
        price: 19,
        features: [
            'All Standard features',
            'Full Journaling + Memory Timeline',
            'Gemini 1.5 agents',
            'Smart Folder creation + override',
            'People tracing + memory filters'
        ]
    },
    veteran: {
        name: 'Veteran',
        price: 49,
        features: [
            'All Pro features',
            'Claude 3 agent chains',
            'Voice assistant journaling',
            'Admin override + agent feedback',
            'API export + collaboration folders'
        ]
    },
    enterprise: {
        name: 'Enterprise',
        price: 149,
        features: [
            'All Veteran features',
            'Dedicated admin dashboards',
            'Audit trail + fallback analytics',
            'Bulk org user onboarding',
            'Custom SLAs and support'
        ]
    },
    creator: {
        name: 'Creator Plan',
        price: 14.99,
        features: [
            'Unlimited journaling + tagging',
            'Gemini/GPT-4 content agent access',
            'Video + audio upload support',
            'Auto-captioning and summarization',
            'Streamlined memory storytelling tools'
        ],
        onboardingCondition: 'selected_creator = true'
    }
};
