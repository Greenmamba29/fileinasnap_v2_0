import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Cpu, 
  Zap,
  Search,
  Code2,
  Workflow,
  Activity,
  Settings,
  Shield,
  ShieldOff,
  Cloud,
  Sparkles,
  PlayCircle,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { hasFeatureAccess, type UserPlan } from '@/lib/featureConfig';

interface MCPIntegrationPanelProps {
  user: UserPlan;
}

const MCPIntegrationPanel = ({ user }: MCPIntegrationPanelProps) => {
  const [mcpEnabled, setMCPEnabled] = useState(false);
  const [safeMode, setSafeMode] = useState(true);
  const [environment, setEnvironment] = useState('development');
  const [currentMode, setCurrentMode] = useState('routeRequest');
  const [commandInput, setCommandInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  // Check if user has access to MCP features
  if (!hasFeatureAccess(user, 'mcpIntegration')) {
    return (
      <Card className="w-full bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">MCP Integration Available</h3>
            <p className="text-gray-600 mb-4">
              Upgrade to Pro, Veteran, or Enterprise to unlock powerful Model Context Protocol integrations with TAMBO and ABACUS.AI.
            </p>
            <Button variant="outline" disabled>
              Upgrade to Access MCP
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleCommand = async () => {
    setIsProcessing(true);
    setResults(null);
    
    try {
      // Simulate API call to MCP endpoints
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = {
        success: true,
        mode: currentMode,
        command: commandInput,
        results: {
          execution_time: '1.2s',
          model_used: user.plan === 'enterprise' ? 'GPT-4o + Claude' : user.plan === 'veteran' ? 'Claude 3 Opus' : 'Gemini',
          components_affected: Math.floor(Math.random() * 5) + 1,
          safety_checks: safeMode ? 'Passed' : 'Bypassed'
        }
      };
      
      setResults(mockResponse);
      setConnectionStatus('connected');
    } catch (error) {
      setResults({ success: false, error: 'Command execution failed' });
    } finally {
      setIsProcessing(false);
    }
  };

  const mcpFeatures = [
    {
      id: 'tamboDesignAssistant',
      icon: Code2,
      title: 'TAMBO Design Assistant',
      description: 'Generate and modify React components with AI assistance.',
      available: hasFeatureAccess(user, 'tamboDesignAssistant'),
    },
    {
      id: 'abacusIntelligence',
      icon: Brain,
      title: 'ABACUS Intelligence',
      description: 'Advanced AI reasoning for complex file organization tasks.',
      available: hasFeatureAccess(user, 'abacusIntelligence'),
    },
    {
      id: 'crossToolSearch',
      icon: Search,
      title: 'Cross-Tool Search',
      description: 'Search across multiple connected tools and services.',
      available: hasFeatureAccess(user, 'crossToolSearch'),
    },
    {
      id: 'realTimeSync',
      icon: Activity,
      title: 'Real-time Sync',
      description: 'Live synchronization with external systems.',
      available: hasFeatureAccess(user, 'realTimeSync'),
    },
    {
      id: 'enterpriseRouting',
      icon: Workflow,
      title: 'Enterprise Routing',
      description: 'Advanced request routing and load balancing.',
      available: hasFeatureAccess(user, 'enterpriseRouting'),
    },
  ];

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-space text-gray-900">MCP Integration Hub</CardTitle>
              <CardDescription className="text-blue-600 font-medium">
                Model Context Protocol with TAMBO & ABACUS.AI for {user.plan} users
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              className={`${connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 
                connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'}`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 
                'bg-red-500'
              }`} />
              {connectionStatus === 'connected' ? 'Live' : 
               connectionStatus === 'connecting' ? 'Connecting' : 'Offline'}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="mcp-enabled"
                checked={mcpEnabled}
                onCheckedChange={setMCPEnabled}
              />
              <label htmlFor="mcp-enabled" className="text-sm font-medium text-gray-700">
                Enable MCP
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="safe-mode"
                checked={safeMode}
                onCheckedChange={setSafeMode}
              />
              <label htmlFor="safe-mode" className="text-sm font-medium text-gray-700 flex items-center">
                {safeMode ? <Shield className="h-3 w-3 mr-1" /> : <ShieldOff className="h-3 w-3 mr-1" />}
                Safe Mode
              </label>
            </div>
          </div>
          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="development">Dev</SelectItem>
              <SelectItem value="production">Prod</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {/* Command Interface */}
        {mcpEnabled && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <Select value={currentMode} onValueChange={setCurrentMode}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routeRequest">📦 Route Request</SelectItem>
                  <SelectItem value="componentUpdate">🧱 Component Update</SelectItem>
                  <SelectItem value="intelligenceQuery">🧠 Intelligence Query</SelectItem>
                  {hasFeatureAccess(user, 'enterpriseRouting') && (
                    <SelectItem value="enterpriseRoute">🏢 Enterprise Route</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Badge variant="outline" className="text-xs">
                {user.plan.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder={
                  currentMode === 'routeRequest' ? 'Enter routing scenario or file organization request...' :
                  currentMode === 'componentUpdate' ? 'Describe component changes needed...' :
                  'Enter your intelligence query...'
                }
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Sparkles className="h-3 w-3" />
                  <span>AI Model: {user.plan === 'enterprise' ? 'GPT-4o + Claude Mix' : user.plan === 'veteran' ? 'Claude 3 Opus' : 'Gemini'}</span>
                </div>
                <Button
                  onClick={handleCommand}
                  disabled={!commandInput.trim() || isProcessing || !mcpEnabled}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw className="h-3 w-3 mr-1 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-3 w-3 mr-1" />
                      Execute
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="mb-6 p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Execution Results</h4>
              <Badge variant={results.success ? "default" : "destructive"}>
                {results.success ? 'Success' : 'Error'}
              </Badge>
            </div>
            {results.success ? (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Execution Time:</span>
                    <span className="ml-2 font-mono">{results.results.execution_time}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Model Used:</span>
                    <span className="ml-2 font-mono">{results.results.model_used}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Components Affected:</span>
                    <span className="ml-2 font-mono">{results.results.components_affected}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Safety Checks:</span>
                    <span className="ml-2 font-mono">{results.results.safety_checks}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>{results.error}</span>
              </div>
            )}
          </div>
        )}

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mcpFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id}
                className={`group transition-all duration-300 cursor-pointer ${
                  feature.available 
                    ? 'hover:shadow-lg border border-gray-200 hover:border-blue-300' 
                    : 'opacity-60 bg-gray-50'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      feature.available 
                        ? 'bg-blue-500 group-hover:scale-110' 
                        : 'bg-gray-400'
                    } transition-transform duration-300`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {feature.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={feature.available ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {feature.available ? 'Available' : 'Upgrade Required'}
                        </Badge>
                        {feature.available && mcpEnabled && (
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                            <PlayCircle className="h-3 w-3 mr-1" />
                            Launch
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {!mcpEnabled && (
          <div className="text-center py-6 border-t border-gray-200 mt-6">
            <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">
              Enable MCP Integration to access powerful AI-driven file organization and component generation tools.
            </p>
            <Button 
              onClick={() => setMCPEnabled(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Zap className="h-4 w-4 mr-2" />
              Enable MCP Integration
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MCPIntegrationPanel;
