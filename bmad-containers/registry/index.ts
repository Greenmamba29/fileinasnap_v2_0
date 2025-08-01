/**
 * Container Registry
 * Central registry for all BMAD containers and feature modules
 */

import { ContainerConfig, FeatureModule } from './types';
import { FileIntelligenceContainer } from '../file-intelligence/container';
import { JournalingContainer } from '../journaling/container';
import { RelationshipContainer } from '../relationships/container';
import { StorytellingContainer } from '../storytelling/container';
import { AdminSupervisorContainer } from '../admin-supervisor/container';
import { PlanName } from '../../pricingConfig';

/**
 * Feature Module Definitions
 * Each module represents a distinct capability with associated containers
 */
export const FEATURE_MODULES: Record<string, FeatureModule> = {
  'file-intelligence': {
    name: 'File Intelligence',
    description: 'AI-powered file organization, renaming, and smart routing',
    containers: ['FileIntelligenceContainer'],
    minimumPlan: 'standard',
    capabilities: [
      'Smart file renaming',
      'Automatic tagging',
      'Folder routing',
      'Content analysis',
      'Duplicate detection'
    ]
  },

  'journaling': {
    name: 'Memory Journaling',
    description: 'Intelligent journal analysis with emotion detection and insight extraction',
    containers: ['JournalingContainer'],
    minimumPlan: 'pro',
    capabilities: [
      'Emotion analysis',
      'Todo extraction',
      'Memory insights',
      'Voice transcription',
      'Timeline organization'
    ]
  },

  'relationships': {
    name: 'Relationship Mapping',
    description: 'Face recognition and social relationship analysis',
    containers: ['RelationshipContainer'],
    minimumPlan: 'veteran',
    capabilities: [
      'Face detection',
      'Person identification',
      'Relationship clustering',
      'Social graph building',
      'Photo organization by people'
    ]
  },

  'storytelling': {
    name: 'AI Storytelling',
    description: 'Generate narratives and stories from memories and files',
    containers: ['StorytellingContainer'],
    minimumPlan: 'veteran',
    capabilities: [
      'Memory compilation',
      'Narrative generation',
      'Story templates',
      'Timeline storytelling',
      'Multimedia integration'
    ]
  },

  'admin-supervisor': {
    name: 'System Administration',
    description: 'System oversight, fallback handling, and audit capabilities',
    containers: ['AdminSupervisorContainer'],
    minimumPlan: 'enterprise',
    capabilities: [
      'System monitoring',
      'Fallback handling',
      'Audit logging',
      'Performance optimization',
      'Manual overrides'
    ]
  }
};

/**
 * Container Registry
 * Maps container names to their implementations
 */
export const CONTAINER_REGISTRY = {
  'FileIntelligenceContainer': FileIntelligenceContainer,
  'JournalingContainer': JournalingContainer,
  'RelationshipContainer': RelationshipContainer,
  'StorytellingContainer': StorytellingContainer,
  'AdminSupervisorContainer': AdminSupervisorContainer
};

/**
 * Trigger to Container Mapping
 * Maps event triggers to appropriate containers
 */
export const TRIGGER_MAPPING: Record<string, string> = {
  // File Intelligence triggers
  'file.uploaded': 'FileIntelligenceContainer',
  'file.drag_drop': 'FileIntelligenceContainer',
  'file.api_upload': 'FileIntelligenceContainer',
  
  // Journaling triggers
  'journal.created': 'JournalingContainer',
  'journal.voice_recorded': 'JournalingContainer',
  'journal.text_input': 'JournalingContainer',
  
  // Relationship triggers
  'image.face_detected': 'RelationshipContainer',
  'relationship.mapping_requested': 'RelationshipContainer',
  'photo.person_tagging': 'RelationshipContainer',
  
  // Storytelling triggers
  'story.generation_requested': 'StorytellingContainer',
  'memory.compilation': 'StorytellingContainer',
  'narrative.creation': 'StorytellingContainer',
  
  // Admin triggers
  'admin.override_panel': 'AdminSupervisorContainer',
  'system.fallback_required': 'AdminSupervisorContainer',
  'admin.manual_intervention': 'AdminSupervisorContainer'
};

/**
 * Get container by name
 */
export function getContainer(containerName: string): any {
  const container = CONTAINER_REGISTRY[containerName];
  if (!container) {
    throw new Error(`Container not found: ${containerName}`);
  }
  return container;
}

/**
 * Get container for trigger
 */
export function getContainerForTrigger(trigger: string): any {
  const containerName = TRIGGER_MAPPING[trigger];
  if (!containerName) {
    throw new Error(`No container found for trigger: ${trigger}`);
  }
  return getContainer(containerName);
}

/**
 * Get available containers for plan
 */
export function getAvailableContainers(planName: PlanName): string[] {
  const available: string[] = [];
  
  Object.entries(CONTAINER_REGISTRY).forEach(([name, containerClass]) => {
    try {
      const config = containerClass.config as ContainerConfig;
      const planLevels = {
        'standard': 1,
        'pro': 2,
        'creator': 2.5,
        'veteran': 3,
        'enterprise': 4,
        'admin': 5
      };
      
      const currentLevel = planLevels[planName] || 0;
      const requiredLevel = planLevels[config.minimumPlan] || 0;
      
      if (currentLevel >= requiredLevel) {
        available.push(name);
      }
    } catch (error) {
      console.warn(`Could not check availability for container: ${name}`);
    }
  });
  
  return available;
}

/**
 * Get feature modules available for plan
 */
export function getAvailableFeatures(planName: PlanName): FeatureModule[] {
  const planLevels = {
    'standard': 1,
    'pro': 2,
    'creator': 2.5,
    'veteran': 3,
    'enterprise': 4,
    'admin': 5
  };
  
  const currentLevel = planLevels[planName] || 0;
  
  return Object.values(FEATURE_MODULES).filter(module => {
    const requiredLevel = planLevels[module.minimumPlan] || 0;
    return currentLevel >= requiredLevel;
  });
}

/**
 * Get all containers for a feature module
 */
export function getModuleContainers(featureModule: string): any[] {
  const module = FEATURE_MODULES[featureModule];
  if (!module) {
    throw new Error(`Feature module not found: ${featureModule}`);
  }
  
  return module.containers.map(containerName => getContainer(containerName));
}

/**
 * Validate container access for plan
 */
export function validateContainerAccess(containerName: string, planName: PlanName): void {
  const container = getContainer(containerName);
  const config = container.config as ContainerConfig;
  
  const planLevels = {
    'standard': 1,
    'pro': 2,
    'creator': 2.5,
    'veteran': 3,
    'enterprise': 4,
    'admin': 5
  };
  
  const currentLevel = planLevels[planName] || 0;
  const requiredLevel = planLevels[config.minimumPlan] || 0;
  
  if (currentLevel < requiredLevel) {
    throw new Error(
      `${containerName} requires ${config.minimumPlan} plan or higher. Current plan: ${planName}`
    );
  }
}