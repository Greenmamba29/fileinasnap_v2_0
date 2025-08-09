import { useState, useEffect, useCallback } from 'react';
import { type UserPlan, hasFeatureAccess } from '@/lib/featureConfig';

interface MCPState {
  isConnected: boolean;
  isLoading: boolean;
  lastCommand: string;
  results: any;
  error: string | null;
  environment: 'development' | 'production';
  safeMode: boolean;
}

interface MCPCommand {
  tool: string;
  args: any;
}

interface MCPHookOptions {
  autoConnect: boolean;
  defaultEnvironment: 'development' | 'production';
  enableSafeMode: boolean;
}

interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
  executionTime?: string;
  modelUsed?: string;
  safetyChecks?: 'Passed' | 'Failed' | 'Bypassed';
}

export const useMCPIntegration = (
  user: UserPlan,
  options: MCPHookOptions = {
    autoConnect: true,
    defaultEnvironment: 'development',
    enableSafeMode: true
  }
) => {
  const [state, setState] = useState<MCPState>({
    isConnected: false,
    isLoading: false,
    lastCommand: '',
    results: null,
    error: null,
    environment: options.defaultEnvironment,
    safeMode: options.enableSafeMode
  });

  // Check if user has MCP access
  const hasMCPAccess = hasFeatureAccess(user, 'mcpIntegration');

  // Initialize connection
  useEffect(() => {
    if (options.autoConnect && hasMCPAccess) {
      connect();
    }
  }, [options.autoConnect, hasMCPAccess]);

  const connect = useCallback(async () => {
    if (!hasMCPAccess) {
      setState(prev => ({
        ...prev,
        error: 'MCP access requires Pro, Veteran, or Enterprise plan'
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate connection to MCP endpoints
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      }));
    }
  }, [hasMCPAccess]);

  const disconnect = useCallback(() => {
    setState(prev => ({
      ...prev,
      isConnected: false,
      error: null
    }));
  }, []);

  const executeCommand = useCallback(async (command: MCPCommand): Promise<MCPResponse> => {
    if (!state.isConnected || !hasMCPAccess) {
      throw new Error('MCP not connected or access denied');
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      lastCommand: `${command.tool}(${JSON.stringify(command.args)})` 
    }));

    try {
      // Determine API endpoint based on environment
      const baseUrl = state.environment === 'production' 
        ? 'https://filesinasnap.com/api/mcp'
        : 'http://localhost:3000/api/mcp';
      
      let endpoint = '';
      switch (command.tool) {
        case 'routeRequest':
          endpoint = `${baseUrl}/execute`;
          break;
        case 'componentUpdate':
          endpoint = `${baseUrl}/update-component`;
          break;
        case 'agentDiagnostics':
          endpoint = `${baseUrl}/run-diagnostics`;
          break;
        default:
          endpoint = `${baseUrl}/execute`;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockResponse: MCPResponse = {
        success: true,
        data: {
          result: `Command ${command.tool} executed successfully`,
          timestamp: new Date().toISOString(),
          ...command.args
        },
        executionTime: `${(Math.random() * 3 + 0.5).toFixed(1)}s`,
        modelUsed: user.plan === 'enterprise' ? 'GPT-4o + Claude' : 
                   user.plan === 'veteran' ? 'Claude 3 Opus' : 'Gemini',
        safetyChecks: state.safeMode ? 'Passed' : 'Bypassed'
      };

      setState(prev => ({ 
        ...prev, 
        results: mockResponse, 
        isLoading: false 
      }));

      return mockResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Command execution failed';
      const errorResponse: MCPResponse = {
        success: false,
        error: errorMessage
      };
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        results: errorResponse, 
        isLoading: false 
      }));
      
      throw new Error(errorMessage);
    }
  }, [state.isConnected, state.environment, state.safeMode, hasMCPAccess, user.plan]);

  // Specific command methods
  const routeRequest = useCallback(async (tier: string, payload: string) => {
    return executeCommand({
      tool: 'routeRequest',
      args: { tier, payload, environment: state.environment }
    });
  }, [executeCommand, state.environment]);

  const updateComponent = useCallback(async (
    componentId: string, 
    instructions: string, 
    author?: string
  ) => {
    if (!hasFeatureAccess(user, 'componentGeneration')) {
      throw new Error('Component generation requires Pro, Veteran, or Enterprise plan');
    }

    return executeCommand({
      tool: 'componentUpdate',
      args: {
        componentId,
        updateInstructions: instructions,
        author: author || 'user',
        environment: state.environment
      }
    });
  }, [executeCommand, state.environment, user]);

  const runDiagnostics = useCallback(async (
    agent: string, 
    scope: 'fast' | 'deep' = 'fast'
  ) => {
    return executeCommand({
      tool: 'agentDiagnostics',
      args: {
        agent,
        scope,
        environment: state.environment
      }
    });
  }, [executeCommand, state.environment]);

  const crossToolSearch = useCallback(async (query: string, filters?: any) => {
    if (!hasFeatureAccess(user, 'crossToolSearch')) {
      throw new Error('Cross-tool search requires Veteran or Enterprise plan');
    }

    return executeCommand({
      tool: 'crossToolSearch',
      args: { query, filters, environment: state.environment }
    });
  }, [executeCommand, state.environment, user]);

  const toggleSafeMode = useCallback(() => {
    setState(prev => ({ ...prev, safeMode: !prev.safeMode }));
  }, []);

  const switchEnvironment = useCallback((environment: 'development' | 'production') => {
    setState(prev => ({ ...prev, environment }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearResults = useCallback(() => {
    setState(prev => ({ ...prev, results: null }));
  }, []);

  return {
    // State
    ...state,
    hasMCPAccess,

    // Connection methods
    connect,
    disconnect,

    // Command execution
    executeCommand,
    routeRequest,
    updateComponent,
    runDiagnostics,
    crossToolSearch,

    // Settings
    toggleSafeMode,
    switchEnvironment,

    // Utilities
    clearError,
    clearResults
  };
};

// Hook for TAMBO-specific integration
export const useTamboMCP = (user: UserPlan) => {
  const mcp = useMCPIntegration(user);

  const generateComponent = useCallback(async (
    description: string,
    requirements?: any
  ) => {
    if (!hasFeatureAccess(user, 'tamboDesignAssistant')) {
      throw new Error('TAMBO Design Assistant requires Pro, Veteran, or Enterprise plan');
    }

    const command = `Generate React component: ${description}`;
    if (requirements) {
      command += ` with requirements: ${JSON.stringify(requirements)}`;
    }

    return mcp.routeRequest(user.plan, command);
  }, [mcp, user.plan]);

  const modifyComponent = useCallback(async (
    componentId: string,
    modifications: string
  ) => {
    return mcp.updateComponent(componentId, modifications);
  }, [mcp]);

  const searchComponents = useCallback(async (query: string) => {
    if (!hasFeatureAccess(user, 'crossToolSearch')) {
      return mcp.routeRequest(user.plan, `Search components: ${query}`);
    }
    
    return mcp.crossToolSearch(query, { 
      sources: ['tambo', 'github'], 
      types: ['component', 'design'] 
    });
  }, [mcp, user.plan]);

  return {
    ...mcp,
    generateComponent,
    modifyComponent,
    searchComponents
  };
};

// Hook for ABACUS intelligence integration
export const useAbacusMCP = (user: UserPlan) => {
  const mcp = useMCPIntegration(user);

  const intelligenceQuery = useCallback(async (
    query: string,
    context?: any
  ) => {
    if (!hasFeatureAccess(user, 'abacusIntelligence')) {
      throw new Error('ABACUS Intelligence requires Veteran or Enterprise plan');
    }

    return mcp.executeCommand({
      tool: 'abacusIntelligence',
      args: { query, context, environment: mcp.environment }
    });
  }, [mcp, user]);

  const analyzeFiles = useCallback(async (
    files: string[],
    analysisType: 'organization' | 'content' | 'relationships' = 'organization'
  ) => {
    if (!hasFeatureAccess(user, 'abacusIntelligence')) {
      throw new Error('ABACUS Intelligence requires Veteran or Enterprise plan');
    }

    return intelligenceQuery(
      `Analyze files for ${analysisType}`,
      { files, analysisType }
    );
  }, [intelligenceQuery, user]);

  const optimizeOrganization = useCallback(async (
    currentStructure: any,
    preferences?: any
  ) => {
    return intelligenceQuery(
      'Optimize file organization structure',
      { currentStructure, preferences }
    );
  }, [intelligenceQuery]);

  return {
    ...mcp,
    intelligenceQuery,
    analyzeFiles,
    optimizeOrganization
  };
};
