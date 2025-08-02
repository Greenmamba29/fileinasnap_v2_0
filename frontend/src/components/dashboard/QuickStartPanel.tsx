
import React from 'react';
import { Card } from '@/components/ui/card';
import { Upload, FolderOpen, BookOpen, Sparkles, Brain } from 'lucide-react';

const QuickStartPanel = () => {
  const agentActions = [
    {
      icon: Upload,
      label: 'Smart Upload',
      description: 'FileOrganizer agent processes files',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      agentTier: 'Standard+'
    },
    {
      icon: FolderOpen,
      label: 'Auto-Organize',
      description: 'AI routing + smart folders',
      color: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600',
      agentTier: 'Standard+'
    },
    {
      icon: BookOpen,
      label: 'Journal Entry',
      description: 'JournalAgent captures memories',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      agentTier: 'Pro+'
    },
    {
      icon: Sparkles,
      label: 'Story Generation',
      description: 'StoryAgent creates narratives',
      color: 'bg-amber-500',
      hoverColor: 'hover:bg-amber-600',
      agentTier: 'Veteran+'
    },
    {
      icon: Brain,
      label: 'SnapBot Assistant',
      description: 'AI memory search & retrieval',
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
      agentTier: 'All Plans'
    }
  ];

  return (
    <Card className="p-6 hover-lift animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-space font-semibold text-gray-900 mb-2">
          Agent Container Actions
        </h2>
        <p className="text-gray-600">Trigger AI agents to process your files and memories</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <div
              key={action.label}
              className={`${action.color} ${action.hoverColor} text-white rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl glow-pulse group animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                  <IconComponent className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{action.label}</h3>
                  <p className="text-sm opacity-90 mb-1">{action.description}</p>
                  <p className="text-xs opacity-75 font-medium">{action.agentTier}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickStartPanel;
