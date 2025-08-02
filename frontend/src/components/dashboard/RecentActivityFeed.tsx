
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Image, Video, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const RecentActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'upload',
      title: 'Beach vacation photos',
      description: '24 photos uploaded and auto-tagged',
      icon: Image,
      time: '2 minutes ago',
      confidence: 'high',
      status: 'completed',
      tags: ['vacation', 'beach', 'summer 2024']
    },
    {
      id: 2,
      type: 'document',
      title: 'Tax documents 2024',
      description: 'PDF processed, extracted key info',
      icon: FileText,
      time: '15 minutes ago',
      confidence: 'medium',
      status: 'needs_review',
      tags: ['tax', 'financial', 'important']
    },
    {
      id: 3,
      type: 'video',
      title: 'Birthday party video',
      description: 'Video transcribed, faces detected',
      icon: Video,
      time: '1 hour ago',
      confidence: 'high',
      status: 'completed',
      tags: ['birthday', 'family', 'celebration']
    },
    {
      id: 4,
      type: 'journal',
      title: 'Memory added to timeline',
      description: 'Linked to 5 related files',
      icon: Clock,
      time: '2 hours ago',
      confidence: 'high',
      status: 'completed',
      tags: ['memory', 'timeline']
    }
  ];

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <Badge className="bg-emerald-100 text-emerald-800">High Confidence</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800">Medium Confidence</Badge>;
      case 'low':
        return <Badge className="bg-red-100 text-red-800">Low Confidence</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'needs_review':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 hover-lift animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-space font-semibold text-gray-900 mb-2">
          Recent Activity
        </h2>
        <p className="text-gray-600">Your latest uploads and AI processing results</p>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <IconComponent className="w-5 h-5 text-gray-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{activity.title}</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(activity.status)}
                    {getConfidenceBadge(activity.confidence)}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {activity.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RecentActivityFeed;
