
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Clock, CheckCircle, AlertTriangle, RefreshCw, Users, FileText, Sparkles } from 'lucide-react';

const AITaskQueue = () => {
  const [activeTab, setActiveTab] = useState('all');

  const agentTasks = [
    {
      id: 1,
      title: 'FileOrganizer: Processing uploads',
      description: 'Analyzing 47 images for auto-tagging and smart routing',
      status: 'processing',
      progress: 65,
      category: 'ai_processing',
      agent: 'FileOrganizer',
      llm: 'Groq'
    },
    {
      id: 2,
      title: 'JournalAgent: Memory extraction',
      description: 'PDF contract needs relationship and context analysis',
      status: 'needs_review',
      progress: 100,
      category: 'user_action',
      agent: 'JournalAgent',
      llm: 'Gemini'
    },
    {
      id: 3,
      title: 'StoryAgent: Narrative generation',
      description: 'Created memory capsule from recent journal entries',
      status: 'completed',
      progress: 100,
      category: 'completed',
      agent: 'StoryAgent',
      llm: 'Claude 3 Opus'
    },
    {
      id: 4,
      title: 'RelationshipAgent: People detection',
      description: 'Scanning photos for face recognition and relationship mapping',
      status: 'processing',
      progress: 30,
      category: 'ai_processing',
      agent: 'RelationshipAgent',
      llm: 'Claude 3 Opus'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'needs_review':
        return <AlertTriangle className="w-4 h-4 text-amber-500 glow-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'needs_review':
        return <Badge className="bg-amber-100 text-amber-800 glow-pulse">Needs Review</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };

  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'FileOrganizer':
        return <FileText className="w-4 h-4" />;
      case 'RelationshipAgent':
        return <Users className="w-4 h-4" />;
      case 'StoryAgent':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const filteredTasks = agentTasks.filter(task => {
    switch (activeTab) {
      case 'ai_needed':
        return task.status === 'processing';
      case 'user_action':
        return task.status === 'needs_review';
      case 'success':
        return task.status === 'completed';
      case 'failed':
        return task.status === 'failed';
      default:
        return true;
    }
  });

  return (
    <Card className="p-6 hover-lift animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-6 h-6 text-blue-500 glow-pulse" />
          <h2 className="text-xl font-space font-semibold text-gray-900">
            Agent Task Queue
          </h2>
        </div>
        <p className="text-gray-600">Real-time BMAD container processing status</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="ai_needed">Processing</TabsTrigger>
          <TabsTrigger value="user_action">Review</TabsTrigger>
          <TabsTrigger value="success">Success</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-3">
            {filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <div className="flex items-center space-x-2">
                      {getAgentIcon(task.agent)}
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                    </div>
                  </div>
                  {getStatusBadge(task.status)}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Agent:</span>
                    <Badge variant="outline" className="text-xs">{task.agent}</Badge>
                    <Badge variant="outline" className="text-xs">{task.llm}</Badge>
                  </div>
                  
                  {task.status === 'processing' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{task.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {filteredTasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No agent tasks in this category</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AITaskQueue;
