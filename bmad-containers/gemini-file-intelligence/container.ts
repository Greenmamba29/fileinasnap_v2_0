/**
 * Gemini File Agent Container
 * Specialized container for Gemini-powered file intelligence
 * 
 * Handles rich metadata processing with mcp_map_stamp integration
 * Optimized for Pro+ plans with Gemini as primary model
 */

import { ContainerBase, ContainerConfig, ContainerOutput } from '../registry/types';
import { PlanName, getAIConfig } from '../../pricingConfig';

export interface GeminiFileInput {
  id: string;
  name: string;
  content: string;
  mime_type: string;
  mcp_map_stamp?: {
    people?: string[];
    place?: string;
    timestamp?: string;
    tags?: string[];
  };
  size?: number;
}

export interface GeminiFileOutput {
  tags: string[];
  summary: string;
  suggestedFolder: string;
  confidence: number;
  mcpEnhancements: {
    extractedPeople: string[];
    extractedPlaces: string[];
    contextualTags: string[];
  };
  smartInsights: {
    fileType: string;
    importance: 'low' | 'medium' | 'high';
    suggestedActions: string[];
  };
  modelUsed: string;
}

export class GeminiFileAgentContainer extends ContainerBase {
  static readonly config: ContainerConfig = {
    name: 'GeminiFileAgentContainer',
    featureModule: 'gemini-file-intelligence',
    triggers: ['file.gemini_analysis', 'file.mcp_processing', 'file.smart_tagging'],
    minimumPlan: 'pro',
    outputSchema: ['tags', 'summary', 'suggestedFolder', 'mcpEnhancements', 'smartInsights'],
    description: 'Gemini-powered file intelligence with MCP metadata integration'
  };

  async execute(
    planName: PlanName,
    input: GeminiFileInput,
    sessionId: string
  ): Promise<ContainerOutput<GeminiFileOutput>> {
    const startTime = Date.now();
    
    try {
      // Validate plan access - Pro+ required for Gemini
      this.validatePlan(planName, GeminiFileAgentContainer.config.minimumPlan);
      
      const model = this.chooseModel(planName);
      const processingLevel = this.getProcessingLevel(planName);
      
      this.log(`Processing file with ${model} (Level ${processingLevel})`, sessionId);
      this.log(`File: ${input.name} (${input.mime_type})`, sessionId);
      
      // Enhanced Gemini processing with MCP integration
      const analysis = await this.processWithGemini(input, model, processingLevel);
      
      const output: GeminiFileOutput = {
        tags: analysis.tags,
        summary: analysis.summary,
        suggestedFolder: analysis.suggestedFolder,
        confidence: analysis.confidence,
        mcpEnhancements: analysis.mcpEnhancements,
        smartInsights: analysis.smartInsights,
        modelUsed: model
      };
      
      this.log(`✅ Gemini analysis complete: ${output.tags.length} tags, confidence ${output.confidence}`, sessionId);
      
      return {
        success: true,
        output,
        processingTime: Date.now() - startTime,
        planUsed: planName,
        containerName: GeminiFileAgentContainer.config.name,
        sessionId
      };
      
    } catch (error: any) {
      this.log(`❌ Gemini file analysis failed: ${error.message}`, sessionId);
      return {
        success: false,
        error: error.message,
        processingTime: Date.now() - startTime,
        planUsed: planName,
        containerName: GeminiFileAgentContainer.config.name,
        sessionId
      };
    }
  }

  private chooseModel(planName: PlanName): string {
    // Gemini model selection by plan
    switch (planName) {
      case 'standard':
        return 'groq-llama3'; // Fallback for Standard (if accidentally accessed)
      case 'pro':
      case 'creator':
        return 'gemini-1.5-pro'; // Primary Gemini model
      case 'veteran':
        return 'claude-3-sonnet'; // Upgrade to Claude for Veteran
      case 'enterprise':
        return 'claude-3-opus'; // Top tier model
      default:
        return 'gemini-1.5-pro';
    }
  }

  private getProcessingLevel(planName: PlanName): number {
    const levels = {
      'pro': 2,         // Gemini enhanced processing
      'creator': 2.5,   // Content optimization
      'veteran': 3,     // Advanced semantic analysis
      'enterprise': 4   // Maximum intelligence
    };
    return levels[planName] || 2;
  }

  private async processWithGemini(
    input: GeminiFileInput,
    model: string,
    level: number
  ): Promise<{
    tags: string[];
    summary: string;
    suggestedFolder: string;
    confidence: number;
    mcpEnhancements: GeminiFileOutput['mcpEnhancements'];
    smartInsights: GeminiFileOutput['smartInsights'];
  }> {
    // Extract tags with Gemini intelligence
    const tags = await this.extractTags(input, model, level);
    
    // Generate summary
    const summary = await this.generateSummary(input, model, level);
    
    // Suggest folder destination
    const suggestedFolder = await this.suggestFolder(input, model, level);
    
    // MCP enhancements based on existing metadata
    const mcpEnhancements = this.enhanceWithMCP(input, level);
    
    // Smart insights
    const smartInsights = await this.generateSmartInsights(input, model, level);
    
    // Calculate confidence based on model and processing level
    const confidence = this.calculateConfidence(input, level);
    
    return {
      tags,
      summary,
      suggestedFolder,
      confidence,
      mcpEnhancements,
      smartInsights
    };
  }

  private async extractTags(input: GeminiFileInput, model: string, level: number): Promise<string[]> {
    const baseTags = [input.mime_type.split('/')[0]];
    
    // Simulate Gemini tag extraction
    const contentTags = await this.analyzeContent(input.content, 'tags', model);
    
    // Add MCP tags if available
    if (input.mcp_map_stamp?.tags) {
      baseTags.push(...input.mcp_map_stamp.tags);
    }
    
    // Enhanced tagging for higher levels
    if (level >= 3) {
      baseTags.push('semantic-enhanced');
      if (input.mcp_map_stamp?.people) {
        baseTags.push('people-identified');
      }
    }
    
    return [...new Set([...baseTags, ...contentTags])];
  }

  private async generateSummary(input: GeminiFileInput, model: string, level: number): Promise<string> {
    const maxLength = level >= 3 ? 200 : 150;
    
    // Simulate Gemini summary generation
    let summary = await this.analyzeContent(input.content.substring(0, 500), 'summary', model);
    
    // Enhance with MCP context
    if (input.mcp_map_stamp?.people && input.mcp_map_stamp.people.length > 0) {
      summary += ` Involves: ${input.mcp_map_stamp.people.join(', ')}`;
    }
    
    if (input.mcp_map_stamp?.place) {
      summary += ` Location: ${input.mcp_map_stamp.place}`;
    }
    
    return summary.length > maxLength ? summary.substring(0, maxLength) + '...' : summary;
  }

  private async suggestFolder(input: GeminiFileInput, model: string, level: number): Promise<string> {
    // Base folder suggestions
    const mimeCategory = input.mime_type.split('/')[0];
    
    if (level >= 3) {
      // Advanced semantic folder suggestion
      if (input.mcp_map_stamp?.place) {
        return `Smart/${input.mcp_map_stamp.place}/${mimeCategory}`;
      }
      
      if (input.mcp_map_stamp?.people && input.mcp_map_stamp.people.length > 0) {
        return `People/${input.mcp_map_stamp.people[0]}/${mimeCategory}`;
      }
      
      // Content-based categorization
      const contentCategory = await this.categorizeContent(input.content);
      return `Smart/${contentCategory}/${mimeCategory}`;
      
    } else if (level >= 2) {
      // Gemini smart categorization
      return `Gemini/${mimeCategory}/${new Date().getFullYear()}`;
    } else {
      // Basic routing
      return `Files/${mimeCategory}`;
    }
  }

  private enhanceWithMCP(input: GeminiFileInput, level: number): GeminiFileOutput['mcpEnhancements'] {
    const enhancements: GeminiFileOutput['mcpEnhancements'] = {
      extractedPeople: [],
      extractedPlaces: [],
      contextualTags: []
    };
    
    // Extract from existing MCP data
    if (input.mcp_map_stamp) {
      enhancements.extractedPeople = input.mcp_map_stamp.people || [];
      enhancements.extractedPlaces = input.mcp_map_stamp.place ? [input.mcp_map_stamp.place] : [];
    }
    
    // Enhanced extraction for higher levels
    if (level >= 3) {
      // Simulate advanced entity extraction from content
      const contentPeople = this.extractEntitiesFromContent(input.content, 'people');
      const contentPlaces = this.extractEntitiesFromContent(input.content, 'places');
      
      enhancements.extractedPeople.push(...contentPeople);
      enhancements.extractedPlaces.push(...contentPlaces);
      
      // Generate contextual tags
      enhancements.contextualTags = this.generateContextualTags(input, level);
    }
    
    // Remove duplicates
    enhancements.extractedPeople = [...new Set(enhancements.extractedPeople)];
    enhancements.extractedPlaces = [...new Set(enhancements.extractedPlaces)];
    
    return enhancements;
  }

  private async generateSmartInsights(
    input: GeminiFileInput,
    model: string,
    level: number
  ): Promise<GeminiFileOutput['smartInsights']> {
    const fileType = this.determineFileType(input);
    const importance = this.assessImportance(input, level);
    const suggestedActions = await this.generateActionSuggestions(input, model, level);
    
    return {
      fileType,
      importance,
      suggestedActions
    };
  }

  private calculateConfidence(input: GeminiFileInput, level: number): number {
    let confidence = 0.7; // Base Gemini confidence
    
    // Boost confidence with MCP data
    if (input.mcp_map_stamp) {
      if (input.mcp_map_stamp.people) confidence += 0.1;
      if (input.mcp_map_stamp.place) confidence += 0.05;
      if (input.mcp_map_stamp.tags) confidence += 0.05;
    }
    
    // Level-based confidence boost
    confidence += (level - 2) * 0.05;
    
    return Math.min(0.95, confidence);
  }

  // Helper methods for content analysis
  private async analyzeContent(content: string, type: 'tags' | 'summary', model: string): Promise<string[]> {
    // Simulate Gemini API call
    if (type === 'tags') {
      // Extract meaningful tags from content
      const words = content.toLowerCase().split(/\s+/);
      const meaningfulWords = words.filter(word => 
        word.length > 3 && 
        !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'she', 'use', 'her', 'now', 'him'].includes(word)
      );
      return meaningfulWords.slice(0, 5);
    }
    
    return [content.substring(0, 100) + '...'];
  }

  private async categorizeContent(content: string): Promise<string> {
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('meeting') || contentLower.includes('agenda')) return 'Meetings';
    if (contentLower.includes('project') || contentLower.includes('plan')) return 'Projects';
    if (contentLower.includes('note') || contentLower.includes('reminder')) return 'Notes';
    if (contentLower.includes('report') || contentLower.includes('analysis')) return 'Reports';
    
    return 'General';
  }

  private extractEntitiesFromContent(content: string, type: 'people' | 'places'): string[] {
    // Simple entity extraction simulation
    const words = content.split(/\s+/);
    const entities: string[] = [];
    
    if (type === 'people') {
      // Look for capitalized words that might be names
      words.forEach(word => {
        if (word.length > 2 && word[0] === word[0].toUpperCase() && 
            word.slice(1) === word.slice(1).toLowerCase()) {
          entities.push(word);
        }
      });
    } else if (type === 'places') {
      // Look for place indicators
      const placeKeywords = ['room', 'office', 'building', 'street', 'avenue', 'city'];
      words.forEach((word, index) => {
        if (placeKeywords.some(keyword => word.toLowerCase().includes(keyword))) {
          if (index > 0) entities.push(words[index - 1]);
          entities.push(word);
        }
      });
    }
    
    return entities.slice(0, 3);
  }

  private generateContextualTags(input: GeminiFileInput, level: number): string[] {
    const tags: string[] = [];
    
    // Time-based tags
    if (input.mcp_map_stamp?.timestamp) {
      const date = new Date(input.mcp_map_stamp.timestamp);
      tags.push(`${date.getFullYear()}`);
      tags.push(`${date.toLocaleDateString('en-US', { month: 'long' })}`);
    }
    
    // Content-based contextual tags
    const content = input.content.toLowerCase();
    if (content.includes('urgent') || content.includes('important')) tags.push('high-priority');
    if (content.includes('follow up') || content.includes('action')) tags.push('actionable');
    if (content.includes('draft') || content.includes('draft')) tags.push('draft');
    
    return tags;
  }

  private determineFileType(input: GeminiFileInput): string {
    const mimeType = input.mime_type;
    
    if (mimeType.startsWith('text/')) return 'Document';
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'Spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentation';
    
    return 'File';
  }

  private assessImportance(input: GeminiFileInput, level: number): 'low' | 'medium' | 'high' {
    let score = 0;
    
    // Content-based importance
    const content = input.content.toLowerCase();
    if (content.includes('urgent') || content.includes('critical')) score += 2;
    if (content.includes('important') || content.includes('priority')) score += 1;
    if (content.includes('meeting') || content.includes('deadline')) score += 1;
    
    // MCP-based importance
    if (input.mcp_map_stamp?.people && input.mcp_map_stamp.people.length > 2) score += 1;
    if (input.mcp_map_stamp?.tags && input.mcp_map_stamp.tags.includes('important')) score += 1;
    
    // File size consideration
    if (input.size && input.size > 1000000) score += 1; // Files > 1MB might be important
    
    if (score >= 3) return 'high';
    if (score >= 1) return 'medium';
    return 'low';
  }

  private async generateActionSuggestions(
    input: GeminiFileInput,
    model: string,
    level: number
  ): Promise<string[]> {
    const suggestions: string[] = [];
    const content = input.content.toLowerCase();
    
    // Content-based suggestions
    if (content.includes('todo') || content.includes('action')) {
      suggestions.push('Extract action items');
    }
    if (content.includes('meeting') && content.includes('notes')) {
      suggestions.push('Schedule follow-up meeting');
      suggestions.push('Share meeting summary');
    }
    if (content.includes('draft') || content.includes('review')) {
      suggestions.push('Request review');
      suggestions.push('Finalize document');
    }
    
    // MCP-based suggestions
    if (input.mcp_map_stamp?.people && input.mcp_map_stamp.people.length > 0) {
      suggestions.push(`Share with ${input.mcp_map_stamp.people.join(', ')}`);
    }
    
    // Level-based enhanced suggestions
    if (level >= 3) {
      suggestions.push('Add to knowledge base');
      suggestions.push('Create related file links');
    }
    
    return suggestions.slice(0, 4);
  }
}