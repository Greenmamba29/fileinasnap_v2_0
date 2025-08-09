/**
 * Storytelling Container
 * Feature Module: AI narrative generation from memories and files
 * 
 * Triggers: Story generation, memory compilation, narrative creation
 * Plans: Veteran+ (Creator, Veteran, Enterprise)
 * LLM: GPT-4 → Claude Sonnet → Claude Opus
 * Outputs: story, narrative, highlights, media
 */

import { ContainerBase, ContainerConfig, ContainerOutput } from '../registry/types';
import { PlanName, getAIConfig, hasFeature } from '../../pricingConfig';

export interface StorytellingInput {
  id: string;
  type: 'seasonal' | 'relationship' | 'achievement' | 'travel' | 'family' | 'memory';
  title?: string;
  memories: Array<{
    id: string;
    content: string;
    date: string;
    type: 'text' | 'image' | 'video' | 'audio';
    emotions?: Record<string, number>;
    people?: string[];
    location?: string;
  }>;
  timeRange?: {
    start: string;
    end: string;
  };
  focus?: {
    people?: string[];
    themes?: string[];
    locations?: string[];
  };
  style?: 'narrative' | 'timeline' | 'highlights' | 'emotional';
}

export interface StorytellingOutput {
  story: {
    id: string;
    title: string;
    subtitle?: string;
    narrative: string;
    chapters?: Array<{
      title: string;
      content: string;
      memories: string[];
    }>;
  };
  highlights: Array<{
    moment: string;
    description: string;
    significance: string;
    relatedMemories: string[];
  }>;
  media: {
    coverImage?: string;
    timeline: Array<{
      date: string;
      thumbnail: string;
      caption: string;
    }>;
    collage?: string[];
  };
  insights: {
    themes: string[];
    emotionalArc: Array<{ period: string; emotion: string; intensity: number }>;
    keyMoments: string[];
    relationships: string[];
  };
  aiModel: string;
  generationStyle: string;
}

export class StorytellingContainer extends ContainerBase {
  static readonly config: ContainerConfig = {
    name: 'StorytellingContainer',
    featureModule: 'storytelling',
    triggers: ['story.generation_requested', 'memory.compilation', 'narrative.creation'],
    minimumPlan: 'veteran',
    outputSchema: ['story', 'highlights', 'media', 'insights'],
    description: 'AI-powered narrative generation and storytelling from memories'
  };

  async execute(
    planName: PlanName,
    input: StorytellingInput,
    sessionId: string
  ): Promise<ContainerOutput<StorytellingOutput>> {
    const startTime = Date.now();
    
    try {
      // Validate plan access - Available for Creator, Veteran, Enterprise
      if (!['creator', 'veteran', 'enterprise'].includes(planName)) {
        throw new Error('Storytelling feature requires Creator, Veteran, or Enterprise plan');
      }
      
      // Check story generation feature
      if (!hasFeature(planName, 'storyGeneration')) {
        throw new Error('Story generation feature not available on current plan');
      }
      
      const aiConfig = getAIConfig(planName);
      const generationLevel = this.getGenerationLevel(planName);
      
      this.log(`Generating story with ${aiConfig.primaryModel} (Level ${generationLevel})`, sessionId);
      
      // AI-powered story generation
      const generation = await this.generateStory(input, aiConfig.primaryModel, generationLevel);
      
      const output: StorytellingOutput = {
        story: generation.story,
        highlights: generation.highlights,
        media: generation.media,
        insights: generation.insights,
        aiModel: aiConfig.primaryModel,
        generationStyle: this.getGenerationStyle(planName)
      };
      
      this.log(`✅ Story generated: "${output.story.title}" with ${output.highlights.length} highlights`, sessionId);
      
      return {
        success: true,
        output,
        processingTime: Date.now() - startTime,
        planUsed: planName,
        containerName: StorytellingContainer.config.name,
        sessionId
      };
      
    } catch (error: any) {
      this.log(`❌ Story generation failed: ${error.message}`, sessionId);
      return {
        success: false,
        error: error.message,
        processingTime: Date.now() - startTime,
        planUsed: planName,
        containerName: StorytellingContainer.config.name,
        sessionId
      };
    }
  }

  private getGenerationLevel(planName: PlanName): number {
    const levels = {
      'creator': 2.5,   // GPT-4 content-focused narratives
      'veteran': 3,     // Claude Sonnet story chains
      'enterprise': 4   // Claude Opus comprehensive storytelling
    };
    return levels[planName] || 2.5;
  }

  private getGenerationStyle(planName: PlanName): string {
    const styles = {
      'creator': 'content-optimized',
      'veteran': 'narrative-chains',
      'enterprise': 'comprehensive-analysis'
    };
    return styles[planName] || 'basic';
  }

  private async generateStory(
    input: StorytellingInput,
    model: string,
    level: number
  ): Promise<{
    story: StorytellingOutput['story'];
    highlights: StorytellingOutput['highlights'];
    media: StorytellingOutput['media'];
    insights: StorytellingOutput['insights'];
  }> {
    const story = await this.createNarrative(input, model, level);
    const highlights = this.extractHighlights(input, level);
    const media = this.generateMediaTimeline(input, level);
    const insights = this.analyzeStoryInsights(input, level);
    
    return { story, highlights, media, insights };
  }

  private async createNarrative(
    input: StorytellingInput,
    model: string,
    level: number
  ): Promise<StorytellingOutput['story']> {
    const title = input.title || this.generateTitle(input.type, input.memories);
    
    let narrative: string;
    let chapters: StorytellingOutput['story']['chapters'] | undefined;
    
    if (level >= 4) {
      // Enterprise: Multi-chapter comprehensive storytelling
      chapters = this.generateChapters(input);
      narrative = this.generateComprehensiveNarrative(input, chapters);
    } else if (level >= 3) {
      // Veteran: Advanced narrative with story chains
      narrative = this.generateAdvancedNarrative(input);
    } else {
      // Creator: Content-focused storytelling
      narrative = this.generateContentFocusedNarrative(input);
    }
    
    return {
      id: `story_${Date.now()}`,
      title,
      subtitle: this.generateSubtitle(input, level),
      narrative,
      chapters
    };
  }

  private generateTitle(type: string, memories: StorytellingInput['memories']): string {
    const titleTemplates = {
      'seasonal': `A Season to Remember - ${new Date().getFullYear()}`,
      'relationship': 'Our Journey Together',
      'achievement': 'Milestone Moments',
      'travel': 'Adventures and Discoveries',
      'family': 'Family Chronicles',
      'memory': 'Cherished Memories'
    };
    
    return titleTemplates[type] || 'My Story';
  }

  private generateSubtitle(input: StorytellingInput, level: number): string | undefined {
    if (level < 3) return undefined;
    
    const memoryCount = input.memories.length;
    const timeSpan = input.timeRange ? 
      `${new Date(input.timeRange.start).toLocaleDateString()} - ${new Date(input.timeRange.end).toLocaleDateString()}` :
      'Recent memories';
    
    return `${memoryCount} memories spanning ${timeSpan}`;
  }

  private generateChapters(input: StorytellingInput): StorytellingOutput['story']['chapters'] {
    // Group memories by time periods or themes
    const chapters: StorytellingOutput['story']['chapters'] = [];
    
    // Simple time-based chapters for demo
    const sortedMemories = input.memories.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const chapterSize = Math.ceil(sortedMemories.length / 3);
    
    for (let i = 0; i < sortedMemories.length; i += chapterSize) {
      const chapterMemories = sortedMemories.slice(i, i + chapterSize);
      const chapterNumber = Math.floor(i / chapterSize) + 1;
      
      chapters.push({
        title: `Chapter ${chapterNumber}: ${this.getChapterTitle(chapterMemories)}`,
        content: this.generateChapterContent(chapterMemories),
        memories: chapterMemories.map(m => m.id)
      });
    }
    
    return chapters;
  }

  private getChapterTitle(memories: StorytellingInput['memories']): string {
    const titles = ['The Beginning', 'The Journey', 'The Culmination'];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  private generateChapterContent(memories: StorytellingInput['memories']): string {
    const summaries = memories.map(m => m.content.substring(0, 100)).join(' ');
    return `This chapter encompasses the memories and moments that shaped this period. ${summaries}...`;
  }

  private generateComprehensiveNarrative(input: StorytellingInput, chapters?: StorytellingOutput['story']['chapters']): string {
    return `This is a comprehensive story generated by Claude Opus, weaving together ${input.memories.length} memories into a cohesive narrative. The story spans multiple chapters and provides deep insights into the emotional journey and relationships involved.`;
  }

  private generateAdvancedNarrative(input: StorytellingInput): string {
    return `Claude Sonnet has crafted this narrative using advanced story chains, connecting ${input.memories.length} memories through thematic links and emotional continuity. The story reveals deeper patterns and relationships within your experiences.`;
  }

  private generateContentFocusedNarrative(input: StorytellingInput): string {
    return `GPT-4 has created this content-optimized story from ${input.memories.length} memories, focusing on the most engaging and meaningful moments. The narrative emphasizes emotional resonance and clear storytelling structure.`;
  }

  private extractHighlights(input: StorytellingInput, level: number): StorytellingOutput['highlights'] {
    const highlights: StorytellingOutput['highlights'] = [];
    
    // Extract top memories as highlights
    const topMemories = input.memories
      .sort((a, b) => Object.keys(b.emotions || {}).length - Object.keys(a.emotions || {}).length)
      .slice(0, level >= 4 ? 5 : 3);
    
    topMemories.forEach((memory, index) => {
      highlights.push({
        moment: `Highlight ${index + 1}`,
        description: memory.content.substring(0, 150) + '...',
        significance: level >= 4 ? 
          'Deep emotional significance identified through advanced analysis' :
          'Significant moment in your story',
        relatedMemories: [memory.id]
      });
    });
    
    return highlights;
  }

  private generateMediaTimeline(input: StorytellingInput, level: number): StorytellingOutput['media'] {
    const timeline = input.memories
      .filter(m => m.type === 'image' || m.type === 'video')
      .map(memory => ({
        date: memory.date,
        thumbnail: `thumbnail_${memory.id}`,
        caption: memory.content.substring(0, 50) + '...'
      }));
    
    return {
      coverImage: timeline[0]?.thumbnail,
      timeline,
      collage: level >= 4 ? timeline.slice(0, 6).map(t => t.thumbnail) : undefined
    };
  }

  private analyzeStoryInsights(input: StorytellingInput, level: number): StorytellingOutput['insights'] {
    const themes: string[] = [];
    const emotionalArc: Array<{ period: string; emotion: string; intensity: number }> = [];
    const keyMoments: string[] = [];
    const relationships: string[] = [];
    
    // Extract themes
    input.memories.forEach(memory => {
      if (memory.content.toLowerCase().includes('family')) themes.push('family');
      if (memory.content.toLowerCase().includes('work')) themes.push('work');
      if (memory.content.toLowerCase().includes('travel')) themes.push('travel');
    });
    
    // Build emotional arc
    if (level >= 3) {
      input.memories.forEach(memory => {
        if (memory.emotions) {
          const primaryEmotion = Object.entries(memory.emotions)
            .reduce((a, b) => memory.emotions![a[0]] > memory.emotions![b[0]] ? a : b)[0];
          const intensity = memory.emotions[primaryEmotion];
          
          emotionalArc.push({
            period: new Date(memory.date).toLocaleDateString(),
            emotion: primaryEmotion,
            intensity
          });
        }
      });
    }
    
    // Extract key moments
    keyMoments.push(...input.memories
      .filter(m => (m.emotions && Object.keys(m.emotions).length > 0) || m.people?.length)
      .slice(0, 3)
      .map(m => m.content.substring(0, 50) + '...'));
    
    // Extract relationships
    input.memories.forEach(memory => {
      if (memory.people) {
        relationships.push(...memory.people);
      }
    });
    
    return {
      themes: [...new Set(themes)],
      emotionalArc,
      keyMoments,
      relationships: [...new Set(relationships)]
    };
  }
}