import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Crown,
  Star,
  Shield,
  Zap,
  Brain,
  Cpu,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Code2,
  Search,
  Activity,
  Lock
} from 'lucide-react';
import { hasFeatureAccess, getUserLLM, type UserPlan } from '@/lib/featureConfig';

interface SubscriptionTierPanelProps {
  user: UserPlan;
}

const SubscriptionTierPanel = ({ user }: SubscriptionTierPanelProps) => {
  const [showYearly, setShowYearly] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<string | null>(null);

  const tierDetails = {
    standard: {
      name: 'Standard',
      icon: Shield,
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      color: 'from-gray-500 to-gray-600',
      badgeColor: 'bg-gray-100 text-gray-800',
      description: 'Perfect for personal file organization',
      features: [
        'File Organizer',
        'Basic AI Search',
        'Cloud Storage (10GB)',
        'Mobile Access',
        'Standard Support'
      ],
      mcpFeatures: []
    },
    pro: {
      name: 'Pro',
      icon: Star,
      monthlyPrice: 24.99,
      yearlyPrice: 249.99,
      color: 'from-blue-500 to-purple-600',
      badgeColor: 'bg-blue-100 text-blue-800',
      description: 'Enhanced features with MCP integration',
      features: [
        'All Standard Features',
        'SnapBot Assistant',
        'Journal Agent',
        'Creator Panel (optional)',
        'MCP Integration',
        'TAMBO Design Assistant',
        'Component Generation',
        'Cloud Storage (100GB)',
        'Priority Support'
      ],
      mcpFeatures: [
        'Basic MCP Protocol Access',
        'TAMBO Component Generation',
        'Gemini AI Model',
        'Development Environment'
      ]
    },
    veteran: {
      name: 'Veteran',
      icon: Crown,
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      color: 'from-purple-500 to-pink-600',
      badgeColor: 'bg-purple-100 text-purple-800',
      description: 'Advanced AI with premium features',
      features: [
        'All Pro Features',
        'SnapBot Insights',
        'Voice Search',
        'Story Agent',
        'Relationship Agent',
        'ABACUS Intelligence',
        'Cross-Tool Search',
        'Real-time Sync',
        'Claude 3 Opus AI',
        'Cloud Storage (1TB)',
        'Expert Support'
      ],
      mcpFeatures: [
        'Advanced MCP Routing',
        'ABACUS.AI Integration',
        'Claude 3 Opus Model',
        'Cross-Tool Search',
        'Real-time Synchronization',
        'Production Environment Access'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      icon: Users,
      monthlyPrice: 99.99,
      yearlyPrice: 999.99,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'Full power with enterprise features',
      features: [
        'All Veteran Features',
        'Admin Supervisor',
        'Full API Access',
        'Enterprise Routing',
        'Custom MCP Endpoints',
        'Advanced Analytics',
        'GPT-4o + Claude Mix',
        'Unlimited Storage',
        'White-label Options',
        'Dedicated Account Manager',
        '24/7 Premium Support'
      ],
      mcpFeatures: [
        'Enterprise MCP Routing',
        'Custom API Endpoints',
        'Multi-Model AI (GPT-4o + Claude)',
        'Advanced Analytics',
        'White-label Integration',
        'Dedicated Infrastructure',
        'SLA Guarantees'
      ]
    }
  };

  const currentTier = tierDetails[user.plan];
  const currentLLM = getUserLLM(user.plan);

  const handleUpgrade = (planName: string) => {
    setSelectedUpgradePlan(planName);
    // In a real app, this would integrate with Stripe or another payment processor
    console.log(`Initiating upgrade to ${planName} plan`);
  };

  const FeatureCheckmark = ({ available }: { available: boolean }) => (
    available ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-gray-400" />
    )
  );

  const TierCard = ({ tierKey, tier, isCurrentPlan }: { tierKey: string, tier: any, isCurrentPlan: boolean }) => {
    const Icon = tier.icon;
    const price = showYearly ? tier.yearlyPrice : tier.monthlyPrice;
    const savings = showYearly ? ((tier.monthlyPrice * 12 - tier.yearlyPrice) / (tier.monthlyPrice * 12) * 100).toFixed(0) : 0;

    return (
      <Card className={`relative transition-all duration-300 ${
        isCurrentPlan 
          ? 'ring-2 ring-blue-500 bg-blue-50' 
          : 'hover:shadow-lg border border-gray-200 hover:border-blue-300'
      }`}>
        {isCurrentPlan && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-blue-500 text-white">Current Plan</Badge>
          </div>
        )}
        
        {tierKey === 'pro' && (
          <div className="absolute -top-3 right-4">
            <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
              Most Popular
            </Badge>
          </div>
        )}

        <CardHeader className="text-center pb-4">
          <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center mb-3`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
          <CardDescription>{tier.description}</CardDescription>
          
          <div className="mt-4">
            <div className="text-3xl font-bold">
              ${price}
              <span className="text-lg font-normal text-gray-500">
                /{showYearly ? 'year' : 'month'}
              </span>
            </div>
            {showYearly && savings > 0 && (
              <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                Save {savings}%
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Standard Features */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Core Features
            </h4>
            <ul className="space-y-2">
              {tier.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-center text-sm">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* MCP Features */}
          {tier.mcpFeatures.length > 0 && (
            <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Cpu className="h-4 w-4 mr-2 text-blue-600" />
                MCP Integration
              </h4>
              <ul className="space-y-2">
                {tier.mcpFeatures.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center text-sm">
                    <Brain className="h-3 w-3 text-blue-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6">
            {isCurrentPlan ? (
              <Button 
                variant="outline" 
                className="w-full" 
                disabled
              >
                Current Plan
              </Button>
            ) : (
              <Button 
                onClick={() => handleUpgrade(tierKey)}
                className={`w-full bg-gradient-to-r ${tier.color} hover:opacity-90`}
              >
                {tierKey === 'standard' ? 'Downgrade' : 'Upgrade'} to {tier.name}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const FeatureComparisonTable = () => {
    const comparisonFeatures = [
      {
        category: 'Core Features',
        features: [
          { name: 'File Organizer', standard: true, pro: true, veteran: true, enterprise: true },
          { name: 'SnapBot Assistant', standard: false, pro: true, veteran: true, enterprise: true },
          { name: 'Voice Search', standard: false, pro: false, veteran: true, enterprise: true },
          { name: 'API Access', standard: false, pro: false, veteran: false, enterprise: true }
        ]
      },
      {
        category: 'AI Models',
        features: [
          { name: 'Basic AI (Groq)', standard: true, pro: false, veteran: false, enterprise: false },
          { name: 'Gemini', standard: false, pro: true, veteran: false, enterprise: false },
          { name: 'Claude 3 Opus', standard: false, pro: false, veteran: true, enterprise: false },
          { name: 'GPT-4o + Mix', standard: false, pro: false, veteran: false, enterprise: true }
        ]
      },
      {
        category: 'MCP Integration',
        features: [
          { name: 'MCP Protocol', standard: false, pro: true, veteran: true, enterprise: true },
          { name: 'TAMBO Components', standard: false, pro: true, veteran: true, enterprise: true },
          { name: 'ABACUS Intelligence', standard: false, pro: false, veteran: true, enterprise: true },
          { name: 'Enterprise Routing', standard: false, pro: false, veteran: false, enterprise: true }
        ]
      }
    ];

    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Feature Comparison
          </CardTitle>
          <CardDescription>
            Compare features across all subscription tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Standard</th>
                  <th className="text-center py-3 px-4">Pro</th>
                  <th className="text-center py-3 px-4">Veteran</th>
                  <th className="text-center py-3 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((category) => (
                  <React.Fragment key={category.category}>
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="py-2 px-4 font-semibold text-gray-900">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 px-4">{feature.name}</td>
                        <td className="text-center py-2 px-4">
                          <FeatureCheckmark available={feature.standard} />
                        </td>
                        <td className="text-center py-2 px-4">
                          <FeatureCheckmark available={feature.pro} />
                        </td>
                        <td className="text-center py-2 px-4">
                          <FeatureCheckmark available={feature.veteran} />
                        </td>
                        <td className="text-center py-2 px-4">
                          <FeatureCheckmark available={feature.enterprise} />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Current Plan Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${currentTier.color} flex items-center justify-center`}>
                <currentTier.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Current Plan: {currentTier.name}</CardTitle>
                <CardDescription>
                  AI Model: {currentLLM} • Creator Track: {user.creatorTrack ? 'Enabled' : 'Disabled'}
                </CardDescription>
              </div>
            </div>
            <Badge className={currentTier.badgeColor}>
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium">AI Model</p>
              <p className="text-lg font-bold text-gray-900">{currentLLM}</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Cpu className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium">MCP Access</p>
              <p className="text-lg font-bold text-gray-900">
                {hasFeatureAccess(user, 'mcpIntegration') ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Sparkles className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Creator Tools</p>
              <p className="text-lg font-bold text-gray-900">
                {hasFeatureAccess(user, 'creatorPanel') ? 'Available' : 'Locked'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm font-medium ${!showYearly ? 'text-gray-900' : 'text-gray-500'}`}>
          Monthly
        </span>
        <Switch
          checked={showYearly}
          onCheckedChange={setShowYearly}
        />
        <span className={`text-sm font-medium ${showYearly ? 'text-gray-900' : 'text-gray-500'}`}>
          Yearly
        </span>
        {showYearly && (
          <Badge className="bg-green-100 text-green-800 ml-2">
            Save up to 17%
          </Badge>
        )}
      </div>

      {/* Tier Cards */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
        {Object.entries(tierDetails).map(([tierKey, tier]) => (
          <TierCard
            key={tierKey}
            tierKey={tierKey}
            tier={tier}
            isCurrentPlan={tierKey === user.plan}
          />
        ))}
      </div>

      {/* MCP Benefits Callout */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-900">
            <Cpu className="h-6 w-6 mr-2" />
            MCP Integration Benefits
          </CardTitle>
          <CardDescription className="text-purple-700">
            Unlock powerful Model Context Protocol integrations with TAMBO and ABACUS.AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Code2 className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">TAMBO Components</h4>
              <p className="text-sm text-gray-600">
                Generate React components with AI assistance and live preview
              </p>
            </div>
            <div className="text-center">
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">ABACUS Intelligence</h4>
              <p className="text-sm text-gray-600">
                Advanced AI reasoning for complex file organization and analysis
              </p>
            </div>
            <div className="text-center">
              <Activity className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Real-time Sync</h4>
              <p className="text-sm text-gray-600">
                Live synchronization across tools and instant updates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Comparison */}
      <FeatureComparisonTable />

      {/* Upgrade CTA */}
      {user.plan !== 'enterprise' && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <Crown className="h-16 w-16 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Ready to unlock more power?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Upgrade your plan to access advanced MCP integrations, powerful AI models, 
                and enterprise-grade features that will transform your workflow.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => handleUpgrade('pro')}
                >
                  Upgrade Now
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg">
                  Contact Sales
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionTierPanel;
