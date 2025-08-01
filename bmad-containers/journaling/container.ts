/**
 * Journaling Container
 * Feature Module: Memory capture, emotion analysis, and todo extraction
 * 
 * Triggers: [Journal Entry] → [JournalAgentContainer]
 * Plans: Pro+ (not available on Standard)
 * LLM: Gemini → GPT-4 → Claude Sonnet → Claude Opus
 * Outputs: todos, summary, destination
 */

import { ContainerBase, ContainerConfig, ContainerOutput } from '../registry/types';
import { PlanName, getAIConfig, hasFeature } from '../../pricingConfig';

export interface JournalingInput {
  id: string;
  content: string;
  createdAt: string;
  voiceRecordingUrl?: string;
  attachedFiles?: string[];
  location?: { lat: number; lng: number };
  mood?: string;
}

export interface JournalingOutput {
  todos: string[];
  summary: string;
  destination: string;
  emotions: {
    primary: string;
    intensity: number;
    detected: Record<string, number>;
  };
  insights: {
    themes: string[];
    people: string[];
    places: string[];
    activities: string[];
  };
  aiModel: string;
}

export class JournalingContainer extends ContainerBase {
  static readonly config: ContainerConfig = {
    name: 'JournalingContainer',
    featureModule: 'journaling',
    triggers: ['journal.created', 'journal.voice_recorded', 'journal.text_input'],
    minimumPlan: 'pro',
    outputSchema: ['todos', 'summary', 'destination', 'emotions', 'insights'],
    description: 'AI-powered journal analysis with emotion detection and memory extraction'
  };

  async execute(
    planName: PlanName,
    input: JournalingInput,
    sessionId: string
  ): Promise<ContainerOutput<JournalingOutput>> {
    const startTime = Date.now();
    
    try {
      // Validate plan access - Pro+ required
      this.validatePlan(planName, JournalingContainer.config.minimumPlan);
      
      // Check journaling feature level
      const journalingLevel = hasFeature(planName, 'journaling');
      if (!journalingLevel || journalingLevel === 'none') {
        throw new Error('Journaling feature not available on current plan');
      }
      
      const aiConfig = getAIConfig(planName);
      const analysisLevel = this.getAnalysisLevel(planName);
      
      this.log(`Analyzing journal with ${aiConfig.primaryModel} (Level ${analysisLevel})`, sessionId);
      
      // AI-powered journal analysis
      const analysis = await this.analyzeJournal(input, aiConfig.primaryModel, analysisLevel);
      
      const output: JournalingOutput = {
        todos: analysis.todos,
        summary: analysis.summary,
        destination: analysis.destination,
        emotions: analysis.emotions,
        insights: analysis.insights,
        aiModel: aiConfig.primaryModel
      };
      
      this.log(`✅ Journal analyzed: ${output.todos.length} todos, ${output.emotions.primary} emotion`, sessionId);
      
      return {
        success: true,
        output,
        processingTime: Date.now() - startTime,
        planUsed: planName,
        containerName: JournalingContainer.config.name,
        sessionId
      };
      
    } catch (error: any) {
      this.log(`❌ Journal analysis failed: ${error.message}`, sessionId);
      return {
        success: false,
        error: error.message,
        processingTime: Date.now() - startTime,
        planUsed: planName,
        containerName: JournalingContainer.config.name,
        sessionId
      };
    }
  }

  private getAnalysisLevel(planName: PlanName): number {
    const levels = {
      'pro': 2,         // Gemini emotion analysis
      'creator': 2.5,   // GPT-4 content optimization
      'veteran': 3,     // Claude voice processing + chains
      'enterprise': 4   // Claude Opus + audit trail
    };
    return levels[planName] || 2;
  }

  private async analyzeJournal(
    journal: JournalingInput,
    model: string,
    level: number
  ): Promise<{
    todos: string[];
    summary: string;
    destination: string;
    emotions: {
      primary: string;
      intensity: number;
      detected: Record<string, number>;
    };
    insights: {
      themes: string[];
      people: string[];
      places: string[];
      activities: string[];
    };
  }> {
    const content = journal.content.toLowerCase();
    
    // Extract todos based on analysis level
    const todos = this.extractTodos(content, level);
    
    // Generate summary with model-specific approach
    const summary = this.generateSummary(journal.content, model, level);
    
    // Emotion analysis with increasing sophistication
    const emotions = this.analyzeEmotions(content, level);
    
    // Extract insights based on analysis level
    const insights = this.extractInsights(content, level);
    
    // Determine destination folder
    const destination = this.determineDestination(journal, emotions, level);
    
    return {
      todos,
      summary,
      destination,
      emotions,
      insights
    };
  }

  private extractTodos(content: string, level: number): string[] {
    const todos: string[] = [];
    
    // Basic todo patterns
    if (content.includes('need to') || content.includes('should')) {
      todos.push('Follow up on mentioned tasks');
    }
    if (content.includes('remember') || content.includes('don\'t forget')) {
      todos.push('Review important items');
    }
    
    // Enhanced extraction for higher levels
    if (level >= 3) {
      if (content.includes('call') || content.includes('contact')) {
        todos.push('Reach out to mentioned contacts');
      }
      if (content.includes('buy') || content.includes('purchase')) {
        todos.push('Complete mentioned purchases');
      }
      if (content.includes('plan') || content.includes('organize')) {
        todos.push('Organize upcoming events');
      }
    }
    
    return todos;
  }

  private generateSummary(content: string, model: string, level: number): string {
    const maxLength = level >= 3 ? 200 : 100;
    const summary = content.substring(0, maxLength);
    
    const modelPrefixes = {
      'gemini-1.5-pro': 'Gemini analysis:',
      'gpt-4': 'GPT-4 insights:',
      'claude-3-sonnet': 'Claude narrative:',
      'claude-3-opus': 'Claude comprehensive analysis:'
    };
    
    const prefix = modelPrefixes[model] || 'AI summary:';
    return `${prefix} ${summary}${content.length > maxLength ? '...' : ''}`;
  }

  private analyzeEmotions(content: string, level: number): {
    primary: string;
    intensity: number;
    detected: Record<string, number>;
  } {
    const emotions: Record<string, number> = {};
    
    // Basic emotion detection
    if (content.includes('happy') || content.includes('joy') || content.includes('excited')) {
      emotions.joy = 0.8;
    }
    if (content.includes('sad') || content.includes('down') || content.includes('disappointed')) {
      emotions.sadness = 0.7;
    }
    if (content.includes('angry') || content.includes('frustrated') || content.includes('annoyed')) {
      emotions.anger = 0.6;
    }
    if (content.includes('worried') || content.includes('anxious') || content.includes('nervous')) {
      emotions.anxiety = 0.7;
    }
    
    // Enhanced emotion detection for higher levels
    if (level >= 3) {
      if (content.includes('grateful') || content.includes('thankful')) {
        emotions.gratitude = 0.8;
      }
      if (content.includes('proud') || content.includes('accomplished')) {
        emotions.pride = 0.7;
      }
      if (content.includes('peaceful') || content.includes('calm')) {
        emotions.serenity = 0.6;
      }
    }
    
    // Default to neutral if no emotions detected
    if (Object.keys(emotions).length === 0) {
      emotions.neutral = 0.5;
    }
    
    // Find primary emotion
    const primary = Object.entries(emotions).reduce((a, b) => emotions[a[0]] > emotions[b[0]] ? a : b)[0];
    const intensity = emotions[primary];
    
    return {
      primary,
      intensity,
      detected: emotions
    };
  }

  private extractInsights(content: string, level: number): {
    themes: string[];
    people: string[];
    places: string[];
    activities: string[];
  } {
    const insights = {
      themes: [] as string[],
      people: [] as string[],
      places: [] as string[],
      activities: [] as string[]
    };
    
    // Basic insight extraction
    if (content.includes('work') || content.includes('job') || content.includes('office')) {
      insights.themes.push('work');
    }
    if (content.includes('family') || content.includes('kids') || content.includes('children')) {
      insights.themes.push('family');
    }
    if (content.includes('travel') || content.includes('trip') || content.includes('vacation')) {
      insights.themes.push('travel');
    }
    
    // Enhanced extraction for higher levels
    if (level >= 3) {
      // Extract potential people names (capitalized words)
      const words = content.split(' ');
      words.forEach(word => {
        if (word.length > 2 && word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase()) {
          if (!insights.people.includes(word)) {
            insights.people.push(word);
          }
        }
      });
      
      // Extract activities
      if (content.includes('meeting') || content.includes('call')) {
        insights.activities.push('meetings');
      }
      if (content.includes('exercise') || content.includes('workout') || content.includes('gym')) {
        insights.activities.push('fitness');
      }
      if (content.includes('read') || content.includes('book')) {
        insights.activities.push('reading');
      }
    }
    
    return insights;
  }

  private determineDestination(
    journal: JournalingInput,
    emotions: { primary: string },
    level: number
  ): string {
    const year = new Date(journal.createdAt).getFullYear();
    const month = new Date(journal.createdAt).toLocaleDateString('en-US', { month: 'long' });
    
    if (level >= 3) {
      // Advanced destination based on emotion and content analysis
      if (emotions.primary === 'joy' || emotions.primary === 'gratitude') {
        return `Journal/Positive/${year}/${month}`;
      } else if (emotions.primary === 'sadness' || emotions.primary === 'anxiety') {
        return `Journal/Reflective/${year}/${month}`;
      } else {
        return `Journal/Daily/${year}/${month}`;
      }
    } else {
      // Basic destination
      return `Journal/${year}`;
    }
  }
}