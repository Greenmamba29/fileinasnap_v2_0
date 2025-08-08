#!/usr/bin/env node
/**
 * BMAD CLI Orchestrator
 * Command-line interface for managing FileInASnap containers and features
 */

import { PlanName, getPricingTier } from '../pricingConfig.js';

// Mock registry for CLI functionality
const CONTAINER_REGISTRY = {
  'FileIntelligenceContainer': class FileIntelligenceContainer {
    static config = {
      name: 'FileIntelligenceContainer',
      featureModule: 'file-intelligence',
      triggers: ['file.uploaded', 'file.drag_drop'],
      minimumPlan: 'standard',
      outputSchema: ['tags', 'folder', 'confidence'],
      description: 'AI-powered file organization'
    };
    async execute(planName, input, sessionId) {
      return {
        success: true,
        output: { tags: ['image'], folder: 'Uploads', confidence: 0.8 },
        processingTime: 500,
        planUsed: planName,
        containerName: 'FileIntelligenceContainer'
      };
    }
  },
  'JournalingContainer': class JournalingContainer {
    static config = {
      name: 'JournalingContainer',
      featureModule: 'journaling',
      triggers: ['journal.created'],
      minimumPlan: 'pro',
      outputSchema: ['todos', 'summary', 'destination'],
      description: 'AI journal analysis'
    };
    async execute(planName, input, sessionId) {
      return {
        success: true,
        output: { todos: ['Review notes'], summary: 'Daily reflection', destination: 'Journal/2025' },
        processingTime: 800,
        planUsed: planName,
        containerName: 'JournalingContainer'
      };
    }
  }
};

function getContainer(containerName) {
  const container = CONTAINER_REGISTRY[containerName];
  if (!container) {
    throw new Error(`Container not found: ${containerName}`);
  }
  return container;
}

function getContainerForTrigger(trigger) {
  const mapping = {
    'file.uploaded': 'FileIntelligenceContainer',
    'journal.created': 'JournalingContainer'
  };
  const containerName = mapping[trigger];
  if (!containerName) {
    throw new Error(`No container found for trigger: ${trigger}`);
  }
  return getContainer(containerName);
}

function getAvailableContainers(planName) {
  const planLevels = { 'standard': 1, 'pro': 2, 'veteran': 3, 'enterprise': 4 };
  const currentLevel = planLevels[planName] || 0;
  
  return Object.entries(CONTAINER_REGISTRY)
    .filter(([name, containerClass]) => {
      const requiredLevel = planLevels[containerClass.config.minimumPlan] || 0;
      return currentLevel >= requiredLevel;
    })
    .map(([name]) => name);
}

function getAvailableFeatures(planName) {
  const features = [
    {
      name: 'File Intelligence',
      description: 'Smart file organization and tagging',
      containers: ['FileIntelligenceContainer'],
      capabilities: ['Auto-tagging', 'Smart routing', 'AI analysis']
    }
  ];
  
  if (['pro', 'veteran', 'enterprise'].includes(planName)) {
    features.push({
      name: 'Memory Journaling',
      description: 'AI-powered journal analysis',
      containers: ['JournalingContainer'],
      capabilities: ['Emotion analysis', 'Todo extraction', 'Memory insights']
    });
  }
  
  return features;
}

function validateContainerAccess(containerName, planName) {
  const container = getContainer(containerName);
  const planLevels = { 'standard': 1, 'pro': 2, 'veteran': 3, 'enterprise': 4 };
  const currentLevel = planLevels[planName] || 0;
  const requiredLevel = planLevels[container.config.minimumPlan] || 0;
  
  if (currentLevel < requiredLevel) {
    throw new Error(`${containerName} requires ${container.config.minimumPlan} plan or higher`);
  }
}

interface CLIOptions {
  plan: PlanName;
  trigger?: string;
  container?: string;
  feature?: string;
  sessionId?: string;
  verbose?: boolean;
}

class BMADOrchestrator {
  private sessionId: string;
  
  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const prefix = `${timestamp} [BMAD-CLI] [${this.sessionId}]`;
    
    switch (level) {
      case 'error':
        console.error(`${prefix} ❌ ${message}`);
        break;
      case 'warn':
        console.warn(`${prefix} ⚠️  ${message}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
    }
  }

  /**
   * Execute container by trigger
   */
  async executeTrigger(trigger: string, planName: PlanName, inputData?: any): Promise<void> {
    try {
      this.log(`🚀 Executing trigger: ${trigger} for plan: ${planName}`);
      
      const Container = getContainerForTrigger(trigger);
      const container = new Container();
      
      // Validate access
      validateContainerAccess(Container.config.name, planName);
      
      // Prepare mock input based on container type
      const input = inputData || this.generateMockInput(Container.config.name);
      
      // Execute container
      const result = await container.execute(planName, input, this.sessionId);
      
      if (result.success) {
        this.log(`✅ Container executed successfully in ${result.processingTime}ms`);
        this.log(`📊 Output: ${JSON.stringify(result.output, null, 2)}`);
      } else {
        this.log(`❌ Container execution failed: ${result.error}`, 'error');
      }
      
    } catch (error: any) {
      this.log(`💥 Trigger execution error: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Execute specific container
   */
  async executeContainer(containerName: string, planName: PlanName, inputData?: any): Promise<void> {
    try {
      this.log(`🤖 Executing container: ${containerName} for plan: ${planName}`);
      
      const Container = getContainer(containerName);
      const container = new Container();
      
      // Validate access
      validateContainerAccess(containerName, planName);
      
      // Prepare mock input
      const input = inputData || this.generateMockInput(containerName);
      
      // Execute container
      const result = await container.execute(planName, input, this.sessionId);
      
      if (result.success) {
        this.log(`✅ Container executed successfully in ${result.processingTime}ms`);
        this.log(`📊 Output: ${JSON.stringify(result.output, null, 2)}`);
      } else {
        this.log(`❌ Container execution failed: ${result.error}`, 'error');
      }
      
    } catch (error: any) {
      this.log(`💥 Container execution error: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * List available containers for plan
   */
  listContainers(planName: PlanName): void {
    this.log(`📋 Listing available containers for plan: ${planName}`);
    
    const available = getAvailableContainers(planName);
    const planInfo = getPricingTier(planName);
    
    console.log(`\n🎯 Plan: ${planInfo.name} ($${planInfo.pricePerMonth}/month)`);
    console.log('==========================================');
    
    if (available.length === 0) {
      console.log('❌ No containers available for this plan');
      return;
    }
    
    available.forEach(containerName => {
      const Container = getContainer(containerName);
      const config = Container.config;
      
      console.log(`\n🤖 ${config.name}`);
      console.log(`   Feature: ${config.featureModule}`);
      console.log(`   Description: ${config.description}`);
      console.log(`   Triggers: ${config.triggers.join(', ')}`);
      console.log(`   Outputs: ${config.outputSchema.join(', ')}`);
    });
    
    console.log('\n');
  }

  /**
   * List available features for plan
   */
  listFeatures(planName: PlanName): void {
    this.log(`🎨 Listing available features for plan: ${planName}`);
    
    const features = getAvailableFeatures(planName);
    const planInfo = getPricingTier(planName);
    
    console.log(`\n🎯 Plan: ${planInfo.name} ($${planInfo.pricePerMonth}/month)`);
    console.log('==========================================');
    
    if (features.length === 0) {
      console.log('❌ No features available for this plan');
      return;
    }
    
    features.forEach(feature => {
      console.log(`\n🎨 ${feature.name}`);
      console.log(`   Description: ${feature.description}`);
      console.log(`   Containers: ${feature.containers.join(', ')}`);
      console.log(`   Capabilities:`);
      feature.capabilities.forEach(cap => {
        console.log(`     • ${cap}`);
      });
    });
    
    console.log('\n');
  }

  /**
   * Run full BMAD pipeline
   */
  async runPipeline(planName: PlanName): Promise<void> {
    this.log(`🚀 Running full BMAD pipeline for plan: ${planName}`);
    
    const available = getAvailableContainers(planName);
    const planInfo = getPricingTier(planName);
    
    console.log(`\n🎯 BMAD Pipeline: ${planInfo.name} ($${planInfo.pricePerMonth}/month)`);
    console.log('='.repeat(60));
    
    let successCount = 0;
    let totalTime = 0;
    
    for (const containerName of available) {
      try {
        console.log(`\n🔄 Phase: ${containerName}`);
        console.log('-'.repeat(40));
        
        const startTime = Date.now();
        await this.executeContainer(containerName, planName);
        const phaseTime = Date.now() - startTime;
        
        totalTime += phaseTime;
        successCount++;
        
        console.log(`✅ Phase completed in ${phaseTime}ms`);
        
      } catch (error: any) {
        console.log(`❌ Phase failed: ${error.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`🎉 BMAD Pipeline Summary:`);
    console.log(`   Successful phases: ${successCount}/${available.length}`);
    console.log(`   Total execution time: ${totalTime}ms`);
    console.log(`   Success rate: ${Math.round((successCount / available.length) * 100)}%`);
  }

  /**
   * Generate mock input data for containers
   */
  private generateMockInput(containerName: string): any {
    const mockData = {
      'FileIntelligenceContainer': {
        id: `file_${this.sessionId}`,
        name: 'vacation_memories_2025.jpg',
        mimeType: 'image/jpeg',
        sizeMb: 3.2,
        content: Buffer.from('mock-image-data'),
        metadata: {
          width: 1920,
          height: 1080,
          location: { lat: 40.7128, lng: -74.0060 },
          timestamp: new Date().toISOString()
        }
      },
      
      'JournalingContainer': {
        id: `journal_${this.sessionId}`,
        content: `Today was amazing! I organized all my vacation photos and memories. 
        The AI suggestions were incredibly helpful for categorizing everything. 
        Need to remember to share the best photos with family. 
        Should also create a photo album for the holidays.`,
        createdAt: new Date().toISOString(),
        voiceRecordingUrl: undefined,
        location: { lat: 40.7128, lng: -74.0060 }
      },
      
      'RelationshipContainer': {
        id: `relationship_${this.sessionId}`,
        imageBuffer: Buffer.from('mock-image-with-faces'),
        existingPeople: ['person_1', 'person_2'],
        context: {
          event: 'Family gathering',
          location: 'New York',
          date: new Date().toISOString()
        }
      },
      
      'StorytellingContainer': {
        id: `story_${this.sessionId}`,
        type: 'seasonal' as const,
        memories: [
          {
            id: 'memory_1',
            content: 'Beautiful sunset at the beach during our summer vacation',
            date: '2025-07-15',
            type: 'image' as const,
            emotions: { joy: 0.8, contentment: 0.6 },
            people: ['family'],
            location: 'California Beach'
          },
          {
            id: 'memory_2', 
            content: 'Had an amazing dinner with friends at the new restaurant',
            date: '2025-07-20',
            type: 'text' as const,
            emotions: { happiness: 0.9, excitement: 0.7 },
            people: ['friends']
          }
        ],
        style: 'narrative' as const
      },
      
      'AdminSupervisorContainer': {
        id: `admin_${this.sessionId}`,
        action: 'monitor' as const,
        reason: 'Routine system health check',
        priority: 'medium' as const,
        context: {
          systemHealth: { overall: 'healthy' }
        }
      }
    };
    
    return mockData[containerName] || {};
  }

  /**
   * Display help information
   */
  showHelp(): void {
    console.log(`
🎯 BMAD CLI Orchestrator - FileInASnap Container Management

USAGE:
  bmad-cli <command> [options]

COMMANDS:
  pipeline <plan>           Run full BMAD pipeline for plan
  container <name> <plan>   Execute specific container
  trigger <event> <plan>    Execute container by trigger
  list containers <plan>    List available containers
  list features <plan>      List available features
  help                      Show this help

PLANS:
  standard    $9/month    - Basic file intelligence (GROQ)
  pro         $19/month   - Enhanced with journaling (Gemini)
  creator     $14.99/month - Content optimization (GPT-4)
  veteran     $49/month   - Advanced features (Claude Sonnet)
  enterprise  $149/month  - Full features (Claude Opus)

EXAMPLES:
  bmad-cli pipeline pro
  bmad-cli container FileIntelligenceContainer standard
  bmad-cli trigger file.uploaded veteran
  bmad-cli list containers enterprise
  bmad-cli list features pro

CONTAINER TRIGGERS:
  file.uploaded, file.drag_drop      -> FileIntelligenceContainer
  journal.created, journal.voice     -> JournalingContainer
  image.face_detected               -> RelationshipContainer
  story.generation_requested        -> StorytellingContainer
  admin.override_panel              -> AdminSupervisorContainer
`);
  }
}

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const orchestrator = new BMADOrchestrator();
  
  if (args.length === 0) {
    orchestrator.showHelp();
    return;
  }
  
  const command = args[0];
  
  try {
    switch (command) {
      case 'pipeline':
        if (args.length < 2) {
          console.error('❌ Usage: bmad-cli pipeline <plan>');
          process.exit(1);
        }
        await orchestrator.runPipeline(args[1] as PlanName);
        break;
        
      case 'container':
        if (args.length < 3) {
          console.error('❌ Usage: bmad-cli container <name> <plan>');
          process.exit(1);
        }
        await orchestrator.executeContainer(args[1], args[2] as PlanName);
        break;
        
      case 'trigger':
        if (args.length < 3) {
          console.error('❌ Usage: bmad-cli trigger <event> <plan>');
          process.exit(1);
        }
        await orchestrator.executeTrigger(args[1], args[2] as PlanName);
        break;
        
      case 'list':
        if (args.length < 3) {
          console.error('❌ Usage: bmad-cli list <containers|features> <plan>');
          process.exit(1);
        }
        if (args[1] === 'containers') {
          orchestrator.listContainers(args[2] as PlanName);
        } else if (args[1] === 'features') {
          orchestrator.listFeatures(args[2] as PlanName);
        } else {
          console.error('❌ Invalid list option. Use "containers" or "features"');
          process.exit(1);
        }
        break;
        
      case 'help':
      case '--help':
      case '-h':
        orchestrator.showHelp();
        break;
        
      default:
        console.error(`❌ Unknown command: ${command}`);
        orchestrator.showHelp();
        process.exit(1);
    }
    
  } catch (error: any) {
    console.error(`💥 CLI Error: ${error.message}`);
    process.exit(1);
  }
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

// Run CLI
main().catch((err) => {
  console.error('💥 Fatal CLI error:', err);
  process.exit(1);
});

export { BMADOrchestrator };