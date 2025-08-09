import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  CreditCard,
  Download,
  Users,
  Activity,
  TrendingUp,
  Clock,
  Zap,
  Brain,
  Cpu,
  Shield,
  AlertTriangle
} from 'lucide-react';
import SubscriptionTierPanel from '@/components/dashboard/SubscriptionTierPanel';
import { type UserPlan, hasFeatureAccess, getUserLLM } from '@/lib/featureConfig';

const SubscriptionPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock user data - in real app this would come from auth/context
  const user: UserPlan = {
    plan: 'pro',
    creatorTrack: true,
  };

  const usageData = {
    storage: { used: 45.2, limit: 100, unit: 'GB' },
    apiCalls: { used: 2847, limit: 10000, unit: 'calls' },
    mcpRequests: { used: 156, limit: 1000, unit: 'requests' },
    components: { used: 23, limit: 50, unit: 'generated' }
  };

  const billingHistory = [
    {
      id: '1',
      date: '2025-01-01',
      amount: 24.99,
      status: 'paid',
      plan: 'Pro',
      period: 'January 2025'
    },
    {
      id: '2',
      date: '2024-12-01',
      amount: 24.99,
      status: 'paid',
      plan: 'Pro',
      period: 'December 2024'
    },
    {
      id: '3',
      date: '2024-11-01',
      amount: 24.99,
      status: 'paid',
      plan: 'Pro',
      period: 'November 2024'
    }
  ];

  const UsageCard = ({ title, icon: Icon, data, color }: any) => {
    const percentage = (data.used / data.limit) * 100;
    const isNearLimit = percentage > 80;
    
    return (
      <Card className={`${isNearLimit ? 'border-orange-200 bg-orange-50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center">
              <Icon className={`h-4 w-4 mr-2 ${color}`} />
              {title}
            </CardTitle>
            {isNearLimit && (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {data.used.toLocaleString()} / {data.limit.toLocaleString()} {data.unit}
              </span>
              <span className={`font-medium ${isNearLimit ? 'text-orange-600' : 'text-gray-900'}`}>
                {percentage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={percentage} 
              className={`h-2 ${isNearLimit ? 'bg-orange-100' : ''}`} 
            />
            {isNearLimit && (
              <p className="text-xs text-orange-600 mt-2">
                Approaching limit - consider upgrading
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const TabButton = ({ id, label, active, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
                <p className="text-gray-600">Manage your FileInASnap subscription and billing</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <CreditCard className="h-4 w-4 mr-2" />
              Update Payment
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 flex space-x-2">
            <TabButton
              id="overview"
              label="Overview"
              active={activeTab === 'overview'}
              onClick={setActiveTab}
            />
            <TabButton
              id="usage"
              label="Usage"
              active={activeTab === 'usage'}
              onClick={setActiveTab}
            />
            <TabButton
              id="plans"
              label="Plans & Pricing"
              active={activeTab === 'plans'}
              onClick={setActiveTab}
            />
            <TabButton
              id="billing"
              label="Billing History"
              active={activeTab === 'billing'}
              onClick={setActiveTab}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Current Plan Overview */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl">Current Subscription</CardTitle>
                <CardDescription>Your active plan and next billing date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Plan</p>
                    <p className="text-xl font-bold text-gray-900">{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</p>
                  </div>
                  <div className="text-center">
                    <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">AI Model</p>
                    <p className="text-xl font-bold text-gray-900">{getUserLLM(user.plan)}</p>
                  </div>
                  <div className="text-center">
                    <Cpu className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">MCP Access</p>
                    <p className="text-xl font-bold text-gray-900">
                      {hasFeatureAccess(user, 'mcpIntegration') ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Next Billing</p>
                    <p className="text-xl font-bold text-gray-900">Feb 1, 2025</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Monthly billing • $24.99/month • Creator Track: {user.creatorTrack ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Cancel Subscription</Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Upgrade Plan</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <UsageCard
                title="Storage Used"
                icon={Download}
                data={usageData.storage}
                color="text-blue-500"
              />
              <UsageCard
                title="API Calls"
                icon={Activity}
                data={usageData.apiCalls}
                color="text-green-500"
              />
              <UsageCard
                title="MCP Requests"
                icon={Cpu}
                data={usageData.mcpRequests}
                color="text-purple-500"
              />
              <UsageCard
                title="Components Generated"
                icon={Zap}
                data={usageData.components}
                color="text-orange-500"
              />
            </div>

            {/* Feature Access Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Feature Access Summary
                </CardTitle>
                <CardDescription>
                  Features available with your current {user.plan} plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Core Features</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>SnapBot Assistant</span>
                        <Badge variant="default">Available</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Voice Search</span>
                        <Badge variant="secondary">Upgrade Required</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Journal Agent</span>
                        <Badge variant="default">Available</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">MCP Integration</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>TAMBO Components</span>
                        <Badge variant="default">Available</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>ABACUS Intelligence</span>
                        <Badge variant="secondary">Upgrade Required</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Real-time Sync</span>
                        <Badge variant="secondary">Upgrade Required</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Creator Tools</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Auto-Storybuilder</span>
                        <Badge variant="default">Available</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Visual Batch Tagger</span>
                        <Badge variant="default">Available</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Content Vault</span>
                        <Badge variant="default">Available</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
                <CardDescription>
                  Monitor your usage across all FileInASnap features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {Object.entries(usageData).map(([key, data]) => {
                    const iconMap = {
                      storage: Download,
                      apiCalls: Activity,
                      mcpRequests: Cpu,
                      components: Zap
                    };
                    const colorMap = {
                      storage: 'text-blue-500',
                      apiCalls: 'text-green-500',
                      mcpRequests: 'text-purple-500',
                      components: 'text-orange-500'
                    };
                    const titleMap = {
                      storage: 'Storage Usage',
                      apiCalls: 'API Calls',
                      mcpRequests: 'MCP Requests',
                      components: 'Components Generated'
                    };
                    
                    return (
                      <UsageCard
                        key={key}
                        title={titleMap[key as keyof typeof titleMap]}
                        icon={iconMap[key as keyof typeof iconMap]}
                        data={data}
                        color={colorMap[key as keyof typeof colorMap]}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'plans' && (
          <div>
            <SubscriptionTierPanel user={user} />
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Billing History
                </CardTitle>
                <CardDescription>
                  View and download your past invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingHistory.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{bill.plan} - {bill.period}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(bill.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant={bill.status === 'paid' ? 'default' : 'destructive'}
                        >
                          {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                        </Badge>
                        <span className="font-medium">${bill.amount}</span>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
