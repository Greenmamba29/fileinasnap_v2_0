import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  CheckCircle, 
  XCircle, 
  Crown, 
  Shield,
  Star,
  Users,
  AlertTriangle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { type UserPlan, hasFeatureAccess, featureConfig } from '@/lib/featureConfig';
import UpgradeGate from '@/components/ui/UpgradeGate';

interface TierValidationReportProps {
  user: UserPlan;
}

const TierValidationReport = ({ user }: TierValidationReportProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [showOnlyRestricted, setShowOnlyRestricted] = useState(false);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Categorize features by type
  const featureCategories = {
    'Core Features': [
      'fileOrganizer',
      'snapBotPanel',
      'snapBotInsights', 
      'voiceSearch',
      'journalAgent',
      'storyAgent',
      'relationshipAgent',
      'adminSupervisor',
      'apiAccess'
    ],
    'Creator Tools': [
      'creatorPanel',
      'autoStorybuilder',
      'visualBatchTagger',
      'captionHashtagAgent',
      'clipFinder',
      'scriptSummaryExtractor',
      'thumbnailMemoryGrid',
      'quietMomentsFinder',
      'contentVaultMode'
    ],
    'MCP Integration': [
      'mcpIntegration',
      'tamboDesignAssistant',
      'abacusIntelligence',
      'crossToolSearch',
      'componentGeneration',
      'realTimeSync',
      'enterpriseRouting',
      'customMCPEndpoints',
      'advancedAnalytics'
    ]
  };

  const planIcons = {
    standard: Shield,
    pro: Star,
    veteran: Crown,
    enterprise: Users
  };

  const planColors = {
    standard: 'text-gray-600',
    pro: 'text-blue-600',
    veteran: 'text-purple-600',
    enterprise: 'text-amber-600'
  };

  const getPlanBadgeColor = (plans: string[]) => {
    const lowestPlan = plans.includes('standard') ? 'standard' :
                      plans.includes('pro') ? 'pro' :
                      plans.includes('veteran') ? 'veteran' : 'enterprise';
    
    return {
      standard: 'bg-gray-100 text-gray-800',
      pro: 'bg-blue-100 text-blue-800',
      veteran: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-amber-100 text-amber-800'
    }[lowestPlan];
  };

  const getRequiredPlan = (plans: string[]): 'pro' | 'veteran' | 'enterprise' => {
    if (plans.includes('pro')) return 'pro';
    if (plans.includes('veteran')) return 'veteran';
    return 'enterprise';
  };

  const allFeatures = Object.entries(featureConfig);
  const accessibleFeatures = allFeatures.filter(([id]) => hasFeatureAccess(user, id));
  const restrictedFeatures = allFeatures.filter(([id]) => !hasFeatureAccess(user, id));

  const filteredCategories = showOnlyRestricted ? 
    Object.fromEntries(
      Object.entries(featureCategories).map(([category, features]) => [
        category, 
        features.filter(id => !hasFeatureAccess(user, id))
      ]).filter(([, features]) => features.length > 0)
    ) : featureCategories;

  const FeatureRow = ({ featureId, feature }: { featureId: string, feature: any }) => {
    const hasAccess = hasFeatureAccess(user, featureId);
    const isCreatorTrackRequired = feature.creatorTrack && !user.creatorTrack;
    
    return (
      <div className={`p-3 border rounded-lg ${hasAccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {hasAccess ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <h4 className="font-semibold text-gray-900 capitalize">
                {featureId.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getPlanBadgeColor(feature.plans)}>
                  {feature.plans[0].charAt(0).toUpperCase() + feature.plans[0].slice(1)}+ Required
                </Badge>
                {feature.creatorTrack && (
                  <Badge variant="outline" className="text-xs">
                    Creator Track
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {!hasAccess && (
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">
                {isCreatorTrackRequired ? 'Enable Creator Track' : `Upgrade to ${feature.plans[0]}`}
              </p>
              <Button size="sm" variant="outline">
                {isCreatorTrackRequired ? 'Enable' : 'Upgrade'}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection('overview')}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                {expandedSections.has('overview') ? 
                  <ChevronDown className="h-5 w-5 mr-2" /> : 
                  <ChevronRight className="h-5 w-5 mr-2" />
                }
                Tier Gate Validation Report
              </CardTitle>
              <CardDescription>
                Current plan: {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} • 
                Creator Track: {user.creatorTrack ? 'Enabled' : 'Disabled'}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show restricted only</span>
              <Switch
                checked={showOnlyRestricted}
                onCheckedChange={setShowOnlyRestricted}
              />
            </div>
          </div>
        </CardHeader>
        
        {expandedSections.has('overview') && (
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">{accessibleFeatures.length}</p>
                <p className="text-sm text-green-600">Features Available</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-700">{restrictedFeatures.length}</p>
                <p className="text-sm text-red-600">Features Restricted</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700">{user.plan}</p>
                <p className="text-sm text-blue-600">Current Plan</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Crown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-700">
                  {restrictedFeatures.length > 0 ? 'Available' : 'None'}
                </p>
                <p className="text-sm text-purple-600">Upgrade Options</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Feature Categories */}
      {Object.entries(filteredCategories).map(([category, features]) => (
        <Card key={category}>
          <CardHeader 
            className="cursor-pointer" 
            onClick={() => toggleSection(category)}
          >
            <CardTitle className="flex items-center">
              {expandedSections.has(category) ? 
                <ChevronDown className="h-5 w-5 mr-2" /> : 
                <ChevronRight className="h-5 w-5 mr-2" />
              }
              {category}
              <Badge className="ml-2" variant="outline">
                {features.length} features
              </Badge>
            </CardTitle>
          </CardHeader>
          
          {expandedSections.has(category) && (
            <CardContent>
              <div className="space-y-3">
                {features.map((featureId) => (
                  <FeatureRow 
                    key={featureId} 
                    featureId={featureId} 
                    feature={featureConfig[featureId]} 
                  />
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {/* Upgrade Recommendations */}
      {restrictedFeatures.length > 0 && (
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-900">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Upgrade Recommendations
            </CardTitle>
            <CardDescription className="text-amber-700">
              Unlock {restrictedFeatures.length} additional features by upgrading your plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Pro Upgrade */}
              {restrictedFeatures.some(([id, feature]) => feature.plans.includes('pro')) && (
                <UpgradeGate
                  featureName="Pro Plan"
                  description="Unlock MCP Integration, TAMBO Design Assistant, and Creator Tools"
                  benefits={[
                    "SnapBot Assistant with AI search",
                    "MCP Integration with TAMBO components",
                    "Creator Panel with 8 advanced tools",
                    "Gemini AI model",
                    "100GB cloud storage"
                  ]}
                  requiredPlan="pro"
                  compact={false}
                />
              )}

              {/* Veteran Upgrade */}
              {restrictedFeatures.some(([id, feature]) => feature.plans.includes('veteran') && !feature.plans.includes('pro')) && (
                <UpgradeGate
                  featureName="Veteran Plan"
                  description="Advanced AI with ABACUS Intelligence and premium features"
                  benefits={[
                    "SnapBot Insights with advanced AI",
                    "Voice search capabilities",
                    "ABACUS Intelligence integration",
                    "Cross-tool search",
                    "Claude 3 Opus AI model"
                  ]}
                  requiredPlan="veteran"
                  compact={false}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Features Accessible */}
      {restrictedFeatures.length === 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <CardContent className="p-8">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                🎉 All Features Unlocked!
              </h3>
              <p className="text-green-700 mb-6">
                You have access to all {allFeatures.length} FileInASnap features with your {user.plan} plan.
              </p>
              <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                Maximum Tier Access
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TierValidationReport;
