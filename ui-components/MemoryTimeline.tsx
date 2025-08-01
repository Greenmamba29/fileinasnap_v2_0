/**
 * Memory Timeline - Lovable Connected Component
 * Plan-aware memory timeline with AI-generated insights
 */

import React, { useState, useEffect } from 'react';
import { PlanName, hasFeature, getPricingTier } from '../../pricingConfig';

interface Memory {
  id: string;
  content: string;
  date: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  emotions?: Record<string, number>;
  tags: string[];
  people?: string[];
  location?: string;
  aiSummary?: string;
  aiInsights?: string[];
}

interface MemoryTimelineProps {
  planName: PlanName;
  memories: Memory[];
  onMemorySelect?: (memory: Memory) => void;
  onStoryGenerate?: (memories: Memory[]) => void;
  viewMode?: 'chronological' | 'emotional' | 'clustered';
  className?: string;
}

interface TimelineCluster {
  id: string;
  title: string;
  period: string;
  memories: Memory[];
  dominantEmotion?: string;
  theme?: string;
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({
  planName,
  memories,
  onMemorySelect,
  onStoryGenerate,
  viewMode = 'chronological',
  className = '',
}) => {
  const [selectedMemories, setSelectedMemories] = useState<string[]>([]);
  const [clusters, setClusters] = useState<TimelineCluster[]>([]);
  const [filterEmotion, setFilterEmotion] = useState<string>('all');
  
  const planInfo = getPricingTier(planName);
  
  // Check plan features
  const features = {
    memoryTimeline: hasFeature(planName, 'memoryTimeline'),
    journaling: hasFeature(planName, 'journaling') !== 'none',
    storyGeneration: hasFeature(planName, 'storyGeneration'),
    peopleTracing: hasFeature(planName, 'peopleTracing'),
    memoryFilters: hasFeature(planName, 'memoryFilters'),
  };

  // Group memories into clusters
  useEffect(() => {
    if (features.memoryTimeline) {
      const clustered = clusterMemories(memories, viewMode);
      setClusters(clustered);
    }
  }, [memories, viewMode, features.memoryTimeline]);

  const clusterMemories = (memories: Memory[], mode: string): TimelineCluster[] => {
    switch (mode) {
      case 'emotional':
        return clusterByEmotion(memories);
      case 'clustered':
        return clusterByTheme(memories);
      default:
        return clusterByTime(memories);
    }
  };

  const clusterByTime = (memories: Memory[]): TimelineCluster[] => {
    const sorted = memories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const clusters: TimelineCluster[] = [];
    
    let currentCluster: TimelineCluster | null = null;
    let currentMonth = '';
    
    sorted.forEach(memory => {
      const memoryMonth = new Date(memory.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      if (memoryMonth !== currentMonth) {
        if (currentCluster) {
          clusters.push(currentCluster);
        }
        
        currentCluster = {
          id: `cluster_${memoryMonth.replace(' ', '_')}`,
          title: memoryMonth,
          period: memoryMonth,
          memories: [memory],
        };
        currentMonth = memoryMonth;
      } else if (currentCluster) {
        currentCluster.memories.push(memory);
      }
    });
    
    if (currentCluster) {
      clusters.push(currentCluster);
    }
    
    return clusters;
  };

  const clusterByEmotion = (memories: Memory[]): TimelineCluster[] => {
    const emotionGroups: Record<string, Memory[]> = {};
    
    memories.forEach(memory => {
      if (memory.emotions) {
        const primaryEmotion = Object.entries(memory.emotions)
          .reduce((a, b) => memory.emotions![a[0]] > memory.emotions![b[0]] ? a : b)[0];
        
        if (!emotionGroups[primaryEmotion]) {
          emotionGroups[primaryEmotion] = [];
        }
        emotionGroups[primaryEmotion].push(memory);
      } else {
        if (!emotionGroups['neutral']) {
          emotionGroups['neutral'] = [];
        }
        emotionGroups['neutral'].push(memory);
      }
    });
    
    return Object.entries(emotionGroups).map(([emotion, memories]) => ({
      id: `emotion_${emotion}`,
      title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Memories`,
      period: `${memories.length} memories`,
      memories: memories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      dominantEmotion: emotion,
    }));
  };

  const clusterByTheme = (memories: Memory[]): TimelineCluster[] => {
    const themeGroups: Record<string, Memory[]> = {};
    
    memories.forEach(memory => {
      let theme = 'general';
      
      // Simple theme detection based on content
      const content = memory.content.toLowerCase();
      if (content.includes('work') || content.includes('job') || content.includes('meeting')) {
        theme = 'work';
      } else if (content.includes('family') || content.includes('kids') || content.includes('parents')) {
        theme = 'family';
      } else if (content.includes('travel') || content.includes('trip') || content.includes('vacation')) {
        theme = 'travel';
      } else if (content.includes('friend') || content.includes('party') || content.includes('social')) {
        theme = 'social';
      }
      
      if (!themeGroups[theme]) {
        themeGroups[theme] = [];
      }
      themeGroups[theme].push(memory);
    });
    
    return Object.entries(themeGroups).map(([theme, memories]) => ({
      id: `theme_${theme}`,
      title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Stories`,
      period: `${memories.length} memories`,
      memories: memories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      theme,
    }));
  };

  const handleMemoryToggle = (memoryId: string) => {
    setSelectedMemories(prev => 
      prev.includes(memoryId)
        ? prev.filter(id => id !== memoryId)
        : [...prev, memoryId]
    );
  };

  const handleGenerateStory = () => {
    if (onStoryGenerate && selectedMemories.length > 0) {
      const selectedMemoryObjects = memories.filter(m => selectedMemories.includes(m.id));
      onStoryGenerate(selectedMemoryObjects);
    }
  };

  const getEmotionEmoji = (emotion: string): string => {
    const emojiMap: Record<string, string> = {
      joy: '😊',
      happiness: '😄',
      sadness: '😢',
      anger: '😠',
      anxiety: '😰',
      gratitude: '🙏',
      pride: '😌',
      serenity: '😌',
      neutral: '😐',
    };
    return emojiMap[emotion] || '💭';
  };

  const getTypeIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      text: '📝',
      image: '📸',
      video: '🎥',
      audio: '🎵',
      file: '📁',
    };
    return iconMap[type] || '📄';
  };

  // Feature upgrade prompt
  if (!features.memoryTimeline) {
    return (
      <div className={`memory-timeline-upgrade ${className}`}>
        <div className="upgrade-prompt bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Memory Timeline</h3>
          <p className="text-gray-600 mb-4">
            Organize and visualize your memories with AI-powered timeline views
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Available on Pro plan and above
          </p>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors">
            Upgrade to Pro - $19/month
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`memory-timeline ${className}`}>
      {/* Timeline Header */}
      <div className="timeline-header mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Memory Timeline</h2>
            <p className="text-gray-600">
              {memories.length} memories • AI-powered insights with {planInfo.aiConfig.primaryModel}
            </p>
          </div>
          
          {features.storyGeneration && selectedMemories.length > 0 && (
            <button
              onClick={handleGenerateStory}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Generate Story ({selectedMemories.length})</span>
            </button>
          )}
        </div>
        
        {/* View Mode Controls */}
        <div className="flex items-center space-x-4">
          <div className="view-modes flex space-x-2">
            {['chronological', 'emotional', 'clustered'].map(mode => (
              <button
                key={mode}
                onClick={() => setSelectedMemories([])}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === mode
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          
          {features.memoryFilters && (
            <select
              value={filterEmotion}
              onChange={(e) => setFilterEmotion(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Emotions</option>
              <option value="joy">Joy</option>
              <option value="sadness">Sadness</option>
              <option value="anxiety">Anxiety</option>
              <option value="gratitude">Gratitude</option>
            </select>
          )}
        </div>
      </div>

      {/* Timeline Clusters */}
      <div className="timeline-clusters space-y-8">
        {clusters.map(cluster => (
          <div key={cluster.id} className="cluster bg-white rounded-lg shadow-sm border p-6">
            <div className="cluster-header mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {cluster.dominantEmotion && (
                    <span className="text-2xl">{getEmotionEmoji(cluster.dominantEmotion)}</span>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{cluster.title}</h3>
                    <p className="text-sm text-gray-500">{cluster.period}</p>
                  </div>
                </div>
                
                {features.storyGeneration && (
                  <button
                    onClick={() => onStoryGenerate && onStoryGenerate(cluster.memories)}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    Create Story
                  </button>
                )}
              </div>
            </div>
            
            {/* Memories in Cluster */}
            <div className="cluster-memories space-y-3">
              {cluster.memories.map(memory => {
                const isSelected = selectedMemories.includes(memory.id);
                
                return (
                  <div
                    key={memory.id}
                    className={`memory-item p-4 rounded border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      handleMemoryToggle(memory.id);
                      onMemorySelect && onMemorySelect(memory);
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="memory-icon">
                        <span className="text-lg">{getTypeIcon(memory.type)}</span>
                      </div>
                      
                      <div className="memory-content flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">
                            {new Date(memory.date).toLocaleDateString()}
                          </span>
                          
                          {memory.emotions && (
                            <div className="emotions flex space-x-1">
                              {Object.entries(memory.emotions).slice(0, 3).map(([emotion, intensity]) => (
                                <span
                                  key={emotion}
                                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                                  title={`${emotion}: ${Math.round(intensity * 100)}%`}
                                >
                                  {getEmotionEmoji(emotion)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-800 mb-2">{memory.content}</p>
                        
                        {memory.aiSummary && (
                          <p className="text-sm text-blue-600 italic mb-2">
                            AI: {memory.aiSummary}
                          </p>
                        )}
                        
                        <div className="memory-meta flex items-center space-x-4 text-xs text-gray-500">
                          {memory.tags.length > 0 && (
                            <div className="tags">
                              Tags: {memory.tags.slice(0, 3).join(', ')}
                            </div>
                          )}
                          
                          {features.peopleTracing && memory.people && memory.people.length > 0 && (
                            <div className="people">
                              People: {memory.people.slice(0, 2).join(', ')}
                            </div>
                          )}
                          
                          {memory.location && (
                            <div className="location">📍 {memory.location}</div>
                          )}
                        </div>
                      </div>
                      
                      {features.storyGeneration && (
                        <div className="memory-select">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleMemoryToggle(memory.id)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {memories.length === 0 && (
        <div className="empty-state text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No memories yet</h3>
          <p className="text-gray-500">Start by uploading files or creating journal entries</p>
        </div>
      )}
    </div>
  );
};