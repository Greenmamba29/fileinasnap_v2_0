export interface UserPlan {
  plan: 'standard' | 'pro' | 'veteran' | 'enterprise';
  creatorTrack?: boolean;
}

export interface FeatureFlag {
  id: string;
  enabled: boolean;
  plans: string[];
  creatorTrack?: boolean;
}

export const featureConfig: Record<string, FeatureFlag> = {
  // SnapBot Panel Features
  snapBotPanel: {
    id: 'snapBotPanel',
    enabled: true,
    plans: ['pro', 'veteran', 'enterprise'],
  },
  snapBotInsights: {
    id: 'snapBotInsights',
    enabled: true,
    plans: ['veteran', 'enterprise'],
  },
  voiceSearch: {
    id: 'voiceSearch',
    enabled: true,
    plans: ['veteran', 'enterprise'],
  },
  
  // Creator Panel Features
  creatorPanel: {
    id: 'creatorPanel',
    enabled: true,
    plans: ['pro', 'veteran'],
    creatorTrack: true,
  },
  autoStorybuilder: {
    id: 'autoStorybuilder',
    enabled: true,
    plans: ['pro', 'veteran'],
    creatorTrack: true,
  },
  visualBatchTagger: {
    id: 'visualBatchTagger',
    enabled: true,
    plans: ['pro', 'veteran'],
    creatorTrack: true,
  },
  captionHashtagAgent: {
    id: 'captionHashtagAgent',
    enabled: true,
    plans: ['pro', 'veteran'],
    creatorTrack: true,
  },
  clipFinder: {
    id: 'clipFinder',
    enabled: true,
    plans: ['pro', 'veteran'],
    creatorTrack: true,
  },
  scriptSummaryExtractor: {
    id: 'scriptSummaryExtractor',
    enabled: true,
    plans: ['pro', 'veteran'],
    creatorTrack: true,
  },
  thumbnailMemoryGrid: {
    id: 'thumbnailMemoryGrid',
    enabled: true,
    plans: ['pro', 'veteran'],
    creatorTrack: true,
  },
  quietMomentsFinder: {
    id: 'quietMomentsFinder',
    enabled: true,
    plans: ['pro', 'veteran'],
    creatorTrack: true,
  },
  contentVaultMode: {
    id: 'contentVaultMode',
    enabled: true,
    plans: ['pro', 'veteran'],
    creatorTrack: true,
  },
  
  // Standard Features
  fileOrganizer: {
    id: 'fileOrganizer',
    enabled: true,
    plans: ['standard', 'pro', 'veteran', 'enterprise'],
  },
  journalAgent: {
    id: 'journalAgent',
    enabled: true,
    plans: ['pro', 'veteran', 'enterprise'],
  },
  storyAgent: {
    id: 'storyAgent',
    enabled: true,
    plans: ['veteran', 'enterprise'],
  },
  relationshipAgent: {
    id: 'relationshipAgent',
    enabled: true,
    plans: ['veteran', 'enterprise'],
  },
  adminSupervisor: {
    id: 'adminSupervisor',
    enabled: true,
    plans: ['enterprise'],
  },
  apiAccess: {
    id: 'apiAccess',
    enabled: true,
    plans: ['enterprise'],
  },
};

export function hasFeatureAccess(
  user: UserPlan,
  featureId: string
): boolean {
  const feature = featureConfig[featureId];
  if (!feature || !feature.enabled) return false;
  
  const hasPlan = feature.plans.includes(user.plan);
  if (!hasPlan) return false;
  
  // Check creator track requirement
  if (feature.creatorTrack && !user.creatorTrack) return false;
  
  return true;
}

export function getUserLLM(plan: string): string {
  switch (plan) {
    case 'standard':
      return 'Groq';
    case 'pro':
      return 'Gemini';
    case 'veteran':
      return 'Claude 3 Opus';
    case 'enterprise':
      return 'GPT-4o + Mix';
    default:
      return 'Groq';
  }
}