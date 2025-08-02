import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Wand2, 
  Grid3X3, 
  Hash, 
  Search, 
  FileText, 
  Image, 
  Volume2, 
  Shield,
  Sparkles,
  Play,
  Edit3,
  Zap
} from 'lucide-react';
import { hasFeatureAccess, type UserPlan } from '@/lib/featureConfig';

interface CreatorPanelProps {
  user: UserPlan;
}

const CreatorPanel = ({ user }: CreatorPanelProps) => {
  const [showInsights, setShowInsights] = useState(false);

  if (!hasFeatureAccess(user, 'creatorPanel')) {
    return null;
  }

  const creatorFeatures = [
    {
      id: 'autoStorybuilder',
      icon: Wand2,
      title: 'Auto-Storybuilder',
      description: 'Create AI-generated highlight reels from grouped memories.',
      action: () => console.log('Launch Story Builder'),
      color: 'bg-purple-500',
    },
    {
      id: 'visualBatchTagger',
      icon: Grid3X3,
      title: 'Visual Batch Tagger',
      description: 'Bulk tag, edit, and caption your content thumbnails and files.',
      action: () => console.log('Open Batch Tagger'),
      color: 'bg-blue-500',
    },
    {
      id: 'captionHashtagAgent',
      icon: Hash,
      title: 'Caption + Hashtag AI',
      description: 'Generate optimal captions and hashtags based on content.',
      action: () => console.log('Generate Captions'),
      color: 'bg-green-500',
    },
    {
      id: 'clipFinder',
      icon: Search,
      title: 'Clip Finder',
      description: 'Ask for moments like "beach shots from June" — SnapBot will fetch them.',
      action: () => console.log('Run Clip Finder'),
      color: 'bg-yellow-500',
    },
    {
      id: 'scriptSummaryExtractor',
      icon: FileText,
      title: 'Script Summary Extractor',
      description: 'Extract hooks, CTAs, and pull quotes from scripts or transcripts.',
      action: () => console.log('Extract Script Summary'),
      color: 'bg-red-500',
    },
    {
      id: 'thumbnailMemoryGrid',
      icon: Image,
      title: 'Thumbnail Memory Grid',
      description: 'View and tag scenes and stills with AI recommendations.',
      action: () => console.log('Show Memory Grid'),
      color: 'bg-indigo-500',
    },
    {
      id: 'quietMomentsFinder',
      icon: Volume2,
      title: 'Quiet Moments Finder',
      description: 'Find calm moments for transitions or looping reels.',
      action: () => console.log('Scan for Quiet Moments'),
      color: 'bg-teal-500',
    },
    {
      id: 'contentVaultMode',
      icon: Shield,
      title: 'Content Vault',
      description: 'Lock your footage with watermark overlays and access control.',
      action: () => console.log('Activate Vault Mode'),
      color: 'bg-gray-700',
    },
  ];

  const availableFeatures = creatorFeatures.filter(feature => 
    hasFeatureAccess(user, feature.id)
  );

  return (
    <Card className="w-full bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-space text-gray-900">Creator Studio</CardTitle>
              <CardDescription className="text-purple-600 font-medium">
                Advanced content creation tools for {user.plan} creators
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1">
            Creator Track
          </Badge>
        </div>
        
        <div className="flex items-center space-x-3 mt-4">
          <Switch
            id="creator-insights"
            checked={showInsights}
            onCheckedChange={setShowInsights}
          />
          <label htmlFor="creator-insights" className="text-sm font-medium text-gray-700">
            Show AI Insights
          </label>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-purple-300"
                onClick={feature.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Launch
                        </Button>
                        {showInsights && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            AI Ready
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {availableFeatures.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit3 className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Creator Tools Coming Soon</h3>
            <p className="text-gray-600">
              Upgrade to Pro or Veteran with Creator Track to unlock these powerful content creation features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatorPanel;