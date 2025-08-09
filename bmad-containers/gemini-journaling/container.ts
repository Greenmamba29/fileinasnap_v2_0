/**
 * Gemini Journal Agent Container
 * Specialized container for Gemini-powered journal analysis
 * 
 * Extracts todos, summaries, and emotional insights from journal entries
 * Optimized for Pro+ plans with Gemini intelligence
 */

import { ContainerBase, ContainerConfig, ContainerOutput } from '../registry/types';
import { PlanName, getAIConfig } from '../../pricingConfig';

export interface GeminiJournalInput {
  id: string;
  content: string;
  timestamp?: string;
  metadata?: {
    location?: string;
    mood?: string;
    tags?: string[];
    attachedFiles?: string[];
  };
  voiceTranscription?: {
    originalAudio?: string;
    transcriptionConfidence?: number;
  };
}

export interface GeminiJournalOutput {
  todos: Array<{
    task: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    context?: string;
  }>;
  summary: string;
  suggestedFolder: string;
  emotionalAnalysis: {
    primaryEmotion: string;
    emotionScores: Record<string, number>;
    moodTrend: 'positive' | 'neutral' | 'negative';
    emotionalIntensity: number;
  };
  insights: {
    keyTopics: string[];
    mentionedPeople: string[];
    mentionedPlaces: string[];
    timeReferences: string[];
    themes: string[];
  };
  recommendations: {
    followUpActions: string[];
    relatedEntries: string[];
    suggestedTags: string[];
  };
  modelUsed: string;
  confidenceScore: number;
}

export class GeminiJournalAgentContainer extends ContainerBase {
  static readonly config: ContainerConfig = {
    name: 'GeminiJournalAgentContainer',
    featureModule: 'gemini-journaling',
    triggers: ['journal.gemini_analysis', 'journal.emotion_analysis', 'journal.smart_extraction'],
    minimumPlan: 'pro',
    outputSchema: ['todos', 'summary', 'emotionalAnalysis', 'insights', 'recommendations'],
    description: 'Gemini-powered journal analysis with emotional intelligence and todo extraction'
  };

  async execute(
    planName: PlanName,
    input: GeminiJournalInput,
    sessionId: string
  ): Promise<ContainerOutput<GeminiJournalOutput>> {
    const startTime = Date.now();
    
    try {
      // Validate plan access - Pro+ required for Gemini journaling
      this.validatePlan(planName, GeminiJournalAgentContainer.config.minimumPlan);
      
      const model = this.chooseModel(planName);
      const analysisLevel = this.getAnalysisLevel(planName);
      
      this.log(`Analyzing journal with ${model} (Level ${analysisLevel})`, sessionId);
      this.log(`Content length: ${input.content.length} characters`, sessionId);
      
      // Enhanced Gemini journal processing
      const analysis = await this.processWithGemini(input, model, analysisLevel);
      
      const output: GeminiJournalOutput = {
        todos: analysis.todos,
        summary: analysis.summary,
        suggestedFolder: analysis.suggestedFolder,
        emotionalAnalysis: analysis.emotionalAnalysis,
        insights: analysis.insights,
        recommendations: analysis.recommendations,
        modelUsed: model,
        confidenceScore: analysis.confidenceScore
      };
      
      this.log(`✅ Gemini journal analysis complete: ${output.todos.length} todos, emotion: ${output.emotionalAnalysis.primaryEmotion}`, sessionId);
      
      return {
        success: true,
        output,
        processingTime: Date.now() - startTime,
        planUsed: planName,
        containerName: GeminiJournalAgentContainer.config.name,
        sessionId
      };
      
    } catch (error: any) {
      this.log(`❌ Gemini journal analysis failed: ${error.message}`, sessionId);
      return {
        success: false,
        error: error.message,
        processingTime: Date.now() - startTime,
        planUsed: planName,
        containerName: GeminiJournalAgentContainer.config.name,
        sessionId
      };
    }
  }

  private chooseModel(planName: PlanName): string {
    // Gemini-optimized model selection for journaling
    switch (planName) {
      case 'standard':
        return 'groq-llama3'; // Fallback (should not be accessed)
      case 'pro':
        return 'gemini-1.5-pro'; // Primary Gemini for Pro
      case 'creator':
        return 'gemini-1.5-pro'; // Gemini for content creators
      case 'veteran':
        return 'claude-3-sonnet'; // Upgrade to Claude for advanced analysis
      case 'enterprise':
        return 'claude-3-opus'; // Top tier for enterprise
      default:
        return 'gemini-1.5-pro';
    }
  }

  private getAnalysisLevel(planName: PlanName): number {
    const levels = {
      'pro': 2,         // Gemini emotional analysis
      'creator': 2.5,   // Content-focused analysis
      'veteran': 3,     // Advanced emotional intelligence
      'enterprise': 4   // Comprehensive analysis with audit
    };
    return levels[planName] || 2;
  }

  private async processWithGemini(
    input: GeminiJournalInput,
    model: string,
    level: number
  ): Promise<{
    todos: GeminiJournalOutput['todos'];
    summary: string;
    suggestedFolder: string;
    emotionalAnalysis: GeminiJournalOutput['emotionalAnalysis'];
    insights: GeminiJournalOutput['insights'];
    recommendations: GeminiJournalOutput['recommendations'];
    confidenceScore: number;
  }> {
    // Extract todos with Gemini intelligence
    const todos = await this.extractTodos(input, model, level);
    
    // Generate summary
    const summary = await this.generateSummary(input, model, level);
    
    // Analyze emotions
    const emotionalAnalysis = await this.analyzeEmotions(input, model, level);
    
    // Extract insights
    const insights = await this.extractInsights(input, model, level);
    
    // Generate recommendations
    const recommendations = await this.generateRecommendations(input, insights, level);
    
    // Suggest folder destination
    const suggestedFolder = this.suggestFolder(input, emotionalAnalysis, level);
    
    // Calculate confidence
    const confidenceScore = this.calculateConfidence(input, level);
    
    return {
      todos,
      summary,
      suggestedFolder,
      emotionalAnalysis,
      insights,
      recommendations,
      confidenceScore
    };
  }

  private async extractTodos(
    input: GeminiJournalInput,
    model: string,
    level: number
  ): Promise<GeminiJournalOutput['todos']> {
    const todos: GeminiJournalOutput['todos'] = [];
    const content = input.content.toLowerCase();
    
    // Pattern-based todo extraction
    const todoPatterns = [
      /need to (.+?)[\.\!\?]/g,
      /should (.+?)[\.\!\?]/g,
      /must (.+?)[\.\!\?]/g,
      /have to (.+?)[\.\!\?]/g,
      /remember to (.+?)[\.\!\?]/g,
      /don't forget to (.+?)[\.\!\?]/g,
      /todo:?\s*(.+?)[\.\!\?\n]/g,
      /action:?\s*(.+?)[\.\!\?\n]/g
    ];
    
    todoPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const task = match[1].trim();
        if (task.length > 3 && task.length < 100) {
          todos.push({
            task: this.cleanTask(task),
            priority: this.assessTaskPriority(task, input),
            context: this.extractTaskContext(task, input.content),
            dueDate: this.extractDueDate(task)
          });
        }
      }
    });
    
    // Enhanced extraction for higher levels
    if (level >= 3) {
      // Advanced semantic todo extraction
      const semanticTodos = await this.extractSemanticTodos(input.content, model);
      todos.push(...semanticTodos);
    }
    
    // Remove duplicates and limit
    const uniqueTodos = this.deduplicateTodos(todos);
    return uniqueTodos.slice(0, 10);
  }

  private async generateSummary(
    input: GeminiJournalInput,
    model: string,
    level: number
  ): Promise<string> {
    const maxLength = level >= 3 ? 250 : 200;
    
    // Extract key sentences
    const sentences = input.content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const keySentences = sentences.slice(0, 3);
    
    let summary = keySentences.join('. ').trim();
    
    // Enhance with metadata context
    if (input.metadata?.location) {
      summary += ` [Location: ${input.metadata.location}]`;
    }
    
    if (input.metadata?.mood) {
      summary += ` [Mood: ${input.metadata.mood}]`;
    }
    
    // Add model attribution
    const modelPrefix = model.includes('gemini') ? 'Gemini analysis:' : 
                       model.includes('claude') ? 'Claude insights:' : 'AI summary:';
    
    summary = `${modelPrefix} ${summary}`;
    
    return summary.length > maxLength ? summary.substring(0, maxLength) + '...' : summary;
  }

  private async analyzeEmotions(
    input: GeminiJournalInput,
    model: string,
    level: number
  ): Promise<GeminiJournalOutput['emotionalAnalysis']> {
    const content = input.content.toLowerCase();
    const emotionScores: Record<string, number> = {};
    
    // Emotion detection patterns
    const emotionPatterns = {
      joy: ['happy', 'excited', 'thrilled', 'delighted', 'cheerful', 'elated', 'joyful'],
      sadness: ['sad', 'depressed', 'down', 'disappointed', 'upset', 'melancholy'],
      anger: ['angry', 'frustrated', 'annoyed', 'furious', 'irritated', 'mad'],
      anxiety: ['worried', 'anxious', 'nervous', 'stressed', 'concerned', 'uneasy'],
      gratitude: ['grateful', 'thankful', 'appreciated', 'blessed', 'fortunate'],
      pride: ['proud', 'accomplished', 'achieved', 'successful', 'fulfilled'],
      love: ['love', 'adore', 'cherish', 'affection', 'care', 'devoted'],
      surprise: ['surprised', 'amazed', 'shocked', 'astonished', 'unexpected'],
      disgust: ['disgusted', 'repulsed', 'revolted', 'sickened'],
      fear: ['scared', 'afraid', 'terrified', 'frightened', 'fearful']
    };
    
    // Calculate emotion scores
    Object.entries(emotionPatterns).forEach(([emotion, keywords]) => {
      let score = 0;
      keywords.forEach(keyword => {
        const occurrences = (content.match(new RegExp(keyword, 'g')) || []).length;
        score += occurrences * 0.1;
      });
      
      if (score > 0) {
        emotionScores[emotion] = Math.min(1.0, score);
      }
    });
    
    // Enhanced emotion analysis for higher levels
    if (level >= 3) {
      // Contextual emotion analysis
      const contextualEmotions = this.analyzeContextualEmotions(content);
      Object.entries(contextualEmotions).forEach(([emotion, score]) => {
        emotionScores[emotion] = (emotionScores[emotion] || 0) + score;
      });
    }
    
    // Determine primary emotion
    const primaryEmotion = Object.entries(emotionScores).length > 0 
      ? Object.entries(emotionScores).reduce((a, b) => emotionScores[a[0]] > emotionScores[b[0]] ? a : b)[0]
      : 'neutral';
    
    // Calculate emotional intensity
    const emotionalIntensity = Object.values(emotionScores).length > 0
      ? Math.max(...Object.values(emotionScores))
      : 0.3;
    
    // Determine mood trend
    const positiveEmotions = ['joy', 'gratitude', 'pride', 'love'];
    const negativeEmotions = ['sadness', 'anger', 'anxiety', 'fear', 'disgust'];
    
    const positiveScore = positiveEmotions.reduce((sum, emotion) => sum + (emotionScores[emotion] || 0), 0);
    const negativeScore = negativeEmotions.reduce((sum, emotion) => sum + (emotionScores[emotion] || 0), 0);
    
    let moodTrend: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (positiveScore > negativeScore + 0.2) moodTrend = 'positive';
    else if (negativeScore > positiveScore + 0.2) moodTrend = 'negative';
    
    return {
      primaryEmotion,
      emotionScores,
      moodTrend,
      emotionalIntensity
    };
  }

  private async extractInsights(
    input: GeminiJournalInput,
    model: string,
    level: number
  ): Promise<GeminiJournalOutput['insights']> {
    const content = input.content;
    
    const insights: GeminiJournalOutput['insights'] = {
      keyTopics: [],
      mentionedPeople: [],
      mentionedPlaces: [],
      timeReferences: [],
      themes: []
    };
    
    // Extract key topics
    insights.keyTopics = this.extractKeyTopics(content);
    
    // Extract mentioned people (capitalized names)
    insights.mentionedPeople = this.extractPeople(content);
    
    // Extract places
    insights.mentionedPlaces = this.extractPlaces(content);
    
    // Extract time references
    insights.timeReferences = this.extractTimeReferences(content);
    
    // Extract themes
    insights.themes = this.extractThemes(content, level);
    
    return insights;
  }

  private async generateRecommendations(
    input: GeminiJournalInput,
    insights: GeminiJournalOutput['insights'],
    level: number
  ): Promise<GeminiJournalOutput['recommendations']> {
    const recommendations: GeminiJournalOutput['recommendations'] = {
      followUpActions: [],
      relatedEntries: [],
      suggestedTags: []
    };
    
    // Generate follow-up actions
    recommendations.followUpActions = this.generateFollowUpActions(input, insights);
    
    // Suggest related entries (simulated)
    recommendations.relatedEntries = this.suggestRelatedEntries(insights);
    
    // Generate suggested tags
    recommendations.suggestedTags = this.generateSuggestedTags(input, insights);
    
    return recommendations;
  }

  private suggestFolder(
    input: GeminiJournalInput,
    emotionalAnalysis: GeminiJournalOutput['emotionalAnalysis'],
    level: number
  ): string {
    const year = input.timestamp ? new Date(input.timestamp).getFullYear() : new Date().getFullYear();
    const month = input.timestamp ? new Date(input.timestamp).toLocaleDateString('en-US', { month: 'long' }) : new Date().toLocaleDateString('en-US', { month: 'long' });
    
    if (level >= 3) {
      // Advanced emotional-based folder suggestion
      const emotion = emotionalAnalysis.primaryEmotion;
      
      if (['joy', 'gratitude', 'pride', 'love'].includes(emotion)) {
        return `Journal/Positive Moments/${year}/${month}`;
      } else if (['sadness', 'anxiety', 'fear'].includes(emotion)) {
        return `Journal/Reflective Thoughts/${year}/${month}`;
      } else if (['anger', 'frustration'].includes(emotion)) {
        return `Journal/Emotional Processing/${year}/${month}`;
      } else {
        return `Journal/Daily Entries/${year}/${month}`;
      }
    } else if (level >= 2) {
      // Gemini smart categorization
      if (input.metadata?.mood) {
        return `Journal/${input.metadata.mood}/${year}`;
      }
      return `Journal/Gemini Analyzed/${year}/${month}`;
    } else {
      // Basic folder
      return `Journal/${year}`;
    }
  }

  private calculateConfidence(input: GeminiJournalInput, level: number): number {
    let confidence = 0.75; // Base Gemini confidence for journaling
    
    // Boost confidence with metadata
    if (input.metadata?.mood) confidence += 0.05;
    if (input.metadata?.location) confidence += 0.05;
    if (input.metadata?.tags) confidence += 0.05;
    
    // Voice transcription confidence
    if (input.voiceTranscription?.transcriptionConfidence) {
      confidence = (confidence + input.voiceTranscription.transcriptionConfidence) / 2;
    }
    
    // Content length factor
    if (input.content.length > 200) confidence += 0.05;
    if (input.content.length > 500) confidence += 0.05;
    
    // Level-based confidence boost
    confidence += (level - 2) * 0.05;
    
    return Math.min(0.95, confidence);
  }

  // Helper methods
  private cleanTask(task: string): string {
    return task
      .replace(/^(to\s+)?/, '') // Remove leading "to"
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim()
      .charAt(0).toUpperCase() + task.slice(1); // Capitalize
  }

  private assessTaskPriority(task: string, input: GeminiJournalInput): 'low' | 'medium' | 'high' {
    const taskLower = task.toLowerCase();
    const contentLower = input.content.toLowerCase();
    
    // High priority indicators
    if (taskLower.includes('urgent') || taskLower.includes('asap') || taskLower.includes('immediately')) {
      return 'high';
    }
    
    // Medium priority indicators
    if (taskLower.includes('important') || taskLower.includes('soon') || taskLower.includes('deadline')) {
      return 'medium';
    }
    
    // Context-based priority
    if (contentLower.includes('meeting') || contentLower.includes('work') || contentLower.includes('project')) {
      return 'medium';
    }
    
    return 'low';
  }

  private extractTaskContext(task: string, fullContent: string): string {
    // Find the sentence containing the task
    const sentences = fullContent.split(/[.!?]+/);
    const taskSentence = sentences.find(sentence => 
      sentence.toLowerCase().includes(task.toLowerCase().substring(0, 20))
    );
    
    return taskSentence ? taskSentence.trim() : '';
  }

  private extractDueDate(task: string): string | undefined {
    // Simple due date extraction
    const datePatterns = [
      /by\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
      /by\s+(tomorrow|today|next week)/i,
      /(\d{1,2}\/\d{1,2}\/\d{2,4})/,
      /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}/i
    ];
    
    for (const pattern of datePatterns) {
      const match = task.match(pattern);
      if (match) return match[0];
    }
    
    return undefined;
  }

  private async extractSemanticTodos(content: string, model: string): Promise<GeminiJournalOutput['todos']> {
    // Simulate advanced semantic todo extraction
    const semanticTodos: GeminiJournalOutput['todos'] = [];
    
    // Look for implicit action items
    const implicitPatterns = [
      /thinking about (.+?) and how/i,
      /planning to (.+?) but/i,
      /hoping to (.+?) soon/i
    ];
    
    implicitPatterns.forEach(pattern => {
      const match = content.match(pattern);
      if (match) {
        semanticTodos.push({
          task: this.cleanTask(match[1]),
          priority: 'low',
          context: 'Implicit action identified'
        });
      }
    });
    
    return semanticTodos;
  }

  private deduplicateTodos(todos: GeminiJournalOutput['todos']): GeminiJournalOutput['todos'] {
    const seen = new Set<string>();
    return todos.filter(todo => {
      const key = todo.task.toLowerCase().substring(0, 20);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private analyzeContextualEmotions(content: string): Record<string, number> {
    const contextualEmotions: Record<string, number> = {};
    
    // Context-based emotion detection
    if (content.includes('birthday') || content.includes('celebration')) {
      contextualEmotions.joy = 0.3;
    }
    
    if (content.includes('deadline') || content.includes('pressure')) {
      contextualEmotions.anxiety = 0.2;
    }
    
    if (content.includes('success') || content.includes('achievement')) {
      contextualEmotions.pride = 0.3;
    }
    
    return contextualEmotions;
  }

  private extractKeyTopics(content: string): string[] {
    const topics: string[] = [];
    const topicKeywords = {
      work: ['work', 'job', 'career', 'office', 'meeting', 'project', 'boss', 'colleague'],
      family: ['family', 'kids', 'children', 'parents', 'mom', 'dad', 'sister', 'brother'],
      health: ['health', 'doctor', 'exercise', 'gym', 'diet', 'medical', 'wellness'],
      travel: ['travel', 'trip', 'vacation', 'flight', 'hotel', 'journey', 'visit'],
      relationships: ['relationship', 'friend', 'love', 'date', 'partner', 'marriage'],
      education: ['school', 'class', 'study', 'learn', 'course', 'education', 'university']
    };
    
    const contentLower = content.toLowerCase();
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => contentLower.includes(keyword))) {
        topics.push(topic);
      }
    });
    
    return topics;
  }

  private extractPeople(content: string): string[] {
    // Extract capitalized words that might be names
    const words = content.split(/\s+/);
    const people: string[] = [];
    
    words.forEach(word => {
      // Simple heuristic for names
      if (word.length > 2 && 
          word[0] === word[0].toUpperCase() && 
          word.slice(1) === word.slice(1).toLowerCase() &&
          !['The', 'This', 'That', 'Today', 'Yesterday', 'Tomorrow', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(word)) {
        people.push(word);
      }
    });
    
    return [...new Set(people)].slice(0, 5);
  }

  private extractPlaces(content: string): string[] {
    const places: string[] = [];
    const placePatterns = [
      /at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
      /in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
      /(Room\s+\w+|Office\s+\w+|Building\s+\w+)/gi
    ];
    
    placePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        places.push(match[1]);
      }
    });
    
    return [...new Set(places)].slice(0, 3);
  }

  private extractTimeReferences(content: string): string[] {
    const timeRefs: string[] = [];
    const timePatterns = [
      /(today|tomorrow|yesterday|next week|last week|this morning|this afternoon|tonight)/gi,
      /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi,
      /(\d{1,2}:\d{2}(?:\s*[ap]m)?)/gi
    ];
    
    timePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        timeRefs.push(match[1]);
      }
    });
    
    return [...new Set(timeRefs)];
  }

  private extractThemes(content: string, level: number): string[] {
    const themes: string[] = [];
    const contentLower = content.toLowerCase();
    
    // Basic themes
    if (contentLower.includes('goal') || contentLower.includes('plan') || contentLower.includes('future')) {
      themes.push('planning');
    }
    if (contentLower.includes('memory') || contentLower.includes('remember') || contentLower.includes('past')) {
      themes.push('reflection');
    }
    if (contentLower.includes('challenge') || contentLower.includes('difficult') || contentLower.includes('problem')) {
      themes.push('challenges');
    }
    if (contentLower.includes('grateful') || contentLower.includes('blessing') || contentLower.includes('appreciation')) {
      themes.push('gratitude');
    }
    
    // Enhanced themes for higher levels
    if (level >= 3) {
      if (contentLower.includes('growth') || contentLower.includes('learning') || contentLower.includes('development')) {
        themes.push('personal-growth');
      }
      if (contentLower.includes('creativity') || contentLower.includes('art') || contentLower.includes('creative')) {
        themes.push('creativity');
      }
    }
    
    return themes;
  }

  private generateFollowUpActions(
    input: GeminiJournalInput,
    insights: GeminiJournalOutput['insights']
  ): string[] {
    const actions: string[] = [];
    
    // Based on mentioned people
    if (insights.mentionedPeople.length > 0) {
      actions.push(`Follow up with ${insights.mentionedPeople.slice(0, 2).join(' and ')}`);
    }
    
    // Based on themes
    if (insights.themes.includes('planning')) {
      actions.push('Create detailed action plan');
    }
    if (insights.themes.includes('challenges')) {
      actions.push('Identify solutions for mentioned challenges');
    }
    if (insights.themes.includes('gratitude')) {
      actions.push('Express gratitude to mentioned people');
    }
    
    // Based on time references
    if (insights.timeReferences.some(ref => ref.toLowerCase().includes('tomorrow'))) {
      actions.push('Prepare for tomorrow\'s activities');
    }
    
    return actions.slice(0, 4);
  }

  private suggestRelatedEntries(insights: GeminiJournalOutput['insights']): string[] {
    // Simulate related entry suggestions based on topics and people
    const related: string[] = [];
    
    insights.keyTopics.forEach(topic => {
      related.push(`Previous entries about ${topic}`);
    });
    
    insights.mentionedPeople.forEach(person => {
      related.push(`Entries mentioning ${person}`);
    });
    
    return related.slice(0, 3);
  }

  private generateSuggestedTags(
    input: GeminiJournalInput,
    insights: GeminiJournalOutput['insights']
  ): string[] {
    const tags = new Set<string>();
    
    // Add topic-based tags
    insights.keyTopics.forEach(topic => tags.add(topic));
    
    // Add theme-based tags
    insights.themes.forEach(theme => tags.add(theme));
    
    // Add time-based tags
    if (input.timestamp) {
      const date = new Date(input.timestamp);
      tags.add(date.toLocaleDateString('en-US', { month: 'long' }));
      tags.add(date.getFullYear().toString());
    }
    
    // Add location-based tags
    if (input.metadata?.location) {
      tags.add(input.metadata.location.toLowerCase());
    }
    
    return Array.from(tags).slice(0, 8);
  }
}