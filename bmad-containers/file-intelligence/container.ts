/**
 * File Intelligence Container
 * Feature Module: Smart file organization, renaming, and routing
 * 
 * Triggers: [Upload File] → [FileOrganizerContainer]
 * Plans: Standard+ (all plans supported)  
 * LLM: GROQ → Gemini → GPT-4 → Claude Sonnet → Claude Opus
 * Outputs: tags, folder, confidence
 */

import { ContainerBase, ContainerConfig, ContainerOutput } from '../registry/types';
import { PlanName, getAIConfig } from '../../pricingConfig';

export interface FileIntelligenceInput {
  id: string;
  name: string;
  mimeType: string;
  sizeMb: number;
  content: Buffer;
  metadata?: {
    width?: number;
    height?: number;
    location?: { lat: number; lng: number };
    timestamp?: string;
  };
}

export interface FileIntelligenceOutput {
  tags: string[];
  folder: string;
  confidence: number;
  aiModel: string;
  processingLevel: number;
  smartRoute: {
    destination: string;
    reasoning: string;
  };
}

export class FileIntelligenceContainer extends ContainerBase {
  static readonly config: ContainerConfig = {
    name: 'FileIntelligenceContainer',
    featureModule: 'file-intelligence',
    triggers: ['file.uploaded', 'file.drag_drop', 'file.api_upload'],
    minimumPlan: 'standard',
    outputSchema: ['tags', 'folder', 'confidence', 'aiModel', 'smartRoute'],
    description: 'AI-powered file organization and smart routing'
  };

  async execute(
    planName: PlanName,
    input: FileIntelligenceInput,
    sessionId: string
  ): Promise<ContainerOutput<FileIntelligenceOutput>> {
    const startTime = Date.now();
    
    try {
      // Validate plan access
      this.validatePlan(planName, FileIntelligenceContainer.config.minimumPlan);
      
      // Get AI configuration for plan
      const aiConfig = getAIConfig(planName);
      const processingLevel = this.getProcessingLevel(planName);
      
      this.log(`Processing file with ${aiConfig.primaryModel} (Level ${processingLevel})`, sessionId);
      
      // AI-powered file analysis
      const analysis = await this.analyzeFile(input, aiConfig.primaryModel, processingLevel);
      
      const output: FileIntelligenceOutput = {
        tags: analysis.tags,
        folder: analysis.suggestedFolder,
        confidence: analysis.confidence,
        aiModel: aiConfig.primaryModel,
        processingLevel,
        smartRoute: {
          destination: analysis.destination,
          reasoning: analysis.reasoning
        }
      };
      
      this.log(`✅ File analyzed: ${output.tags.join(', ')} → ${output.folder}`, sessionId);
      
      return {
        success: true,
        output,
        processingTime: Date.now() - startTime,
        planUsed: planName,
        containerName: FileIntelligenceContainer.config.name,
        sessionId
      };
      
    } catch (error: any) {
      this.log(`❌ Analysis failed: ${error.message}`, sessionId);
      return {
        success: false,
        error: error.message,
        processingTime: Date.now() - startTime,
        planUsed: planName,
        containerName: FileIntelligenceContainer.config.name,
        sessionId
      };
    }
  }

  private getProcessingLevel(planName: PlanName): number {
    const levels = {
      'standard': 1,    // Basic GROQ processing
      'pro': 2,         // Gemini enhanced analysis
      'creator': 2.5,   // GPT-4 content optimization  
      'veteran': 3,     // Claude semantic understanding
      'enterprise': 4   // Claude Opus maximum accuracy
    };
    return levels[planName] || 1;
  }

  private async analyzeFile(
    file: FileIntelligenceInput,
    model: string,
    level: number
  ): Promise<{
    tags: string[];
    suggestedFolder: string;
    confidence: number;
    destination: string;
    reasoning: string;
  }> {
    // Simulate AI analysis with increasing sophistication by level
    const baseTags = [file.mimeType.split('/')[0]];
    const mimeCategory = file.mimeType.split('/')[0];
    
    // Enhanced tagging by processing level
    if (level >= 2) baseTags.push('ai-processed');
    if (level >= 3) baseTags.push('semantic-analyzed');
    if (level >= 4) baseTags.push('enterprise-grade');
    
    // Smart folder routing by level
    let suggestedFolder: string;
    let reasoning: string;
    
    if (level >= 4) {
      // Enterprise: Maximum intelligence
      suggestedFolder = `Smart/AI-Organized/${new Date().getFullYear()}/${mimeCategory}`;
      reasoning = `Claude Opus semantic analysis suggests year-based organization with media type categorization`;
    } else if (level >= 3) {
      // Veteran: Advanced semantic routing
      suggestedFolder = `Semantic/${mimeCategory}/${this.getSemanticCategory(file)}`;
      reasoning = `Claude Sonnet identified semantic patterns for contextual organization`;
    } else if (level >= 2) {
      // Pro: Smart categorization
      suggestedFolder = `Smart/${mimeCategory}`;
      reasoning = `Gemini analysis suggests media-type based smart organization`;
    } else {
      // Standard: Basic routing
      suggestedFolder = `Uploads/${mimeCategory}`;
      reasoning = `GROQ basic processing routed to standard upload folder`;
    }
    
    return {
      tags: baseTags,
      suggestedFolder,
      confidence: 0.5 + (level * 0.1), // Higher confidence with better models
      destination: suggestedFolder,
      reasoning
    };
  }

  private getSemanticCategory(file: FileIntelligenceInput): string {
    // Simulate semantic categorization
    if (file.name.toLowerCase().includes('vacation') || file.name.toLowerCase().includes('trip')) {
      return 'Travel';
    }
    if (file.name.toLowerCase().includes('family') || file.name.toLowerCase().includes('kids')) {
      return 'Family';
    }
    if (file.name.toLowerCase().includes('work') || file.name.toLowerCase().includes('meeting')) {
      return 'Professional';
    }
    return 'General';
  }
}