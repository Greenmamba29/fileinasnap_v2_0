import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  ArrowRight, 
  Sparkles, 
  Star, 
  Users,
  LucideIcon
} from 'lucide-react';

interface UpgradeGateProps {
  featureName: string;
  description: string;
  benefits: string[];
  requiredPlan: 'pro' | 'veteran' | 'enterprise';
  icon?: LucideIcon;
  onUpgrade?: () => void;
  compact?: boolean;
}

const planDetails = {
  pro: {
    name: 'Pro',
    price: '$24.99/month',
    color: 'from-blue-500 to-purple-600',
    badgeColor: 'bg-blue-100 text-blue-800',
    icon: Star
  },
  veteran: {
    name: 'Veteran',
    price: '$49.99/month',
    color: 'from-purple-500 to-pink-600',
    badgeColor: 'bg-purple-100 text-purple-800',
    icon: Crown
  },
  enterprise: {
    name: 'Enterprise',
    price: '$99.99/month',
    color: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-100 text-amber-800',
    icon: Users
  }
};

const UpgradeGate: React.FC<UpgradeGateProps> = ({
  featureName,
  description,
  benefits,
  requiredPlan,
  icon: IconComponent,
  onUpgrade,
  compact = false
}) => {
  const plan = planDetails[requiredPlan];
  const PlanIcon = plan.icon;
  const FeatureIcon = IconComponent || Sparkles;

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default upgrade flow - could integrate with routing
      console.log(`Initiating upgrade to ${plan.name} plan for ${featureName}`);
      // In a real app, this would navigate to subscription page or open payment modal
      window.location.href = '/subscription?upgrade=' + requiredPlan;
    }
  };

  if (compact) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <FeatureIcon className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{featureName}</h4>
                <p className="text-xs text-gray-600">{description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={plan.badgeColor}>
                {plan.name}
              </Badge>
              <Button size="sm" onClick={handleUpgrade}>
                Upgrade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
      <CardContent className="p-8">
        <div className="text-center">
          {/* Feature Icon */}
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FeatureIcon className="h-8 w-8 text-gray-500" />
          </div>

          {/* Feature Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">{featureName}</h3>
          
          {/* Description */}
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {description}
          </p>

          {/* Benefits List */}
          {benefits.length > 0 && (
            <div className="space-y-2 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center justify-center text-sm text-gray-700">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-3"></span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}

          {/* Plan Requirements */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
              <PlanIcon className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">{plan.name} Plan</p>
              <p className="text-sm text-gray-600">{plan.price}</p>
            </div>
          </div>

          {/* Upgrade Button */}
          <Button 
            onClick={handleUpgrade}
            className={`bg-gradient-to-r ${plan.color} hover:opacity-90 text-white px-8 py-3`}
            size="lg"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to {plan.name}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          {/* Additional Context */}
          <p className="text-xs text-gray-500 mt-4">
            {requiredPlan === 'enterprise' ? (
              <>Available on Enterprise plan • Contact sales for team pricing</>
            ) : requiredPlan === 'veteran' ? (
              <>Available on Veteran and Enterprise plans</>
            ) : (
              <>Available on Pro, Veteran, and Enterprise plans</>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradeGate;
