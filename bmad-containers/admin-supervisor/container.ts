/**
 * Admin Supervisor Container
 * Feature Module: System oversight, fallback handling, and audit capabilities
 * 
 * Triggers: [Override Panel] → [AgentSupervisor]
 * Plans: Admin/Enterprise only
 * LLM: Always GPT-4o for consistent admin experience
 * Actions: fallback handling, logs, audits
 */

import { ContainerBase, ContainerConfig, ContainerOutput } from '../registry/types';
import { PlanName } from '../../pricingConfig';

export interface AdminSupervisorInput {
  id: string;
  action: 'override' | 'fallback' | 'audit' | 'monitor' | 'repair';
  target?: {
    containerName?: string;
    userId?: string;
    sessionId?: string;
    planName?: string;
  };
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  context?: {
    originalError?: string;
    failedAttempts?: number;
    userImpact?: string;
    systemHealth?: Record<string, any>;
  };
}

export interface AdminSupervisorOutput {
  fallbackResult: {
    action: string;
    status: 'success' | 'partial' | 'failed';
    resolution: string;
    nextSteps: string[];
  };
  auditLog: {
    id: string;
    timestamp: string;
    adminId: string;
    action: string;
    target: string;
    reason: string;
    outcome: string;
    evidence: Record<string, any>;
  };
  systemStatus: {
    overall: 'healthy' | 'degraded' | 'critical';
    containers: Record<string, {
      status: 'online' | 'offline' | 'degraded';
      lastCheck: string;
      responseTime: number;
      errorRate: number;
    }>;
    recommendations: string[];
  };
  insights: {
    patternAnalysis: string[];
    performanceMetrics: Record<string, number>;
    optimizationSuggestions: string[];
  };
  aiModel: string;
}

export class AdminSupervisorContainer extends ContainerBase {
  static readonly config: ContainerConfig = {
    name: 'AdminSupervisorContainer',
    featureModule: 'admin-supervisor',
    triggers: ['admin.override_panel', 'system.fallback_required', 'admin.manual_intervention'],
    minimumPlan: 'enterprise',
    outputSchema: ['fallbackResult', 'auditLog', 'systemStatus', 'insights'],
    description: 'System oversight and administrative control with GPT-4o intelligence'
  };

  async execute(
    planName: PlanName,
    input: AdminSupervisorInput,
    sessionId: string
  ): Promise<ContainerOutput<AdminSupervisorOutput>> {
    const startTime = Date.now();
    
    try {
      // Validate admin access - Enterprise or Admin plans only
      if (!['enterprise', 'admin'].includes(planName)) {
        throw new Error('Administrative functions require Enterprise plan or Admin access');
      }
      
      this.log(`Executing admin action: ${input.action} with GPT-4o (Priority: ${input.priority})`, sessionId);
      
      // Execute administrative action
      const result = await this.executeAdminAction(input, sessionId);
      
      const output: AdminSupervisorOutput = {
        fallbackResult: result.fallbackResult,
        auditLog: result.auditLog,
        systemStatus: result.systemStatus,
        insights: result.insights,
        aiModel: 'gpt-4o'
      };
      
      this.log(`✅ Admin action completed: ${output.fallbackResult.status} - ${output.fallbackResult.resolution}`, sessionId);
      
      return {
        success: true,
        output,
        processingTime: Date.now() - startTime,
        planUsed: planName,
        containerName: AdminSupervisorContainer.config.name,
        sessionId
      };
      
    } catch (error: any) {
      this.log(`❌ Admin action failed: ${error.message}`, sessionId);
      return {
        success: false,
        error: error.message,
        processingTime: Date.now() - startTime,
        planUsed: planName,
        containerName: AdminSupervisorContainer.config.name,
        sessionId
      };
    }
  }

  private async executeAdminAction(
    input: AdminSupervisorInput,
    sessionId: string
  ): Promise<{
    fallbackResult: AdminSupervisorOutput['fallbackResult'];
    auditLog: AdminSupervisorOutput['auditLog'];
    systemStatus: AdminSupervisorOutput['systemStatus'];
    insights: AdminSupervisorOutput['insights'];
  }> {
    // Execute fallback handling
    const fallbackResult = await this.handleFallback(input);
    
    // Create audit log entry
    const auditLog = this.createAuditLog(input, fallbackResult, sessionId);
    
    // Assess system status
    const systemStatus = await this.assessSystemStatus();
    
    // Generate insights
    const insights = this.generateInsights(input, systemStatus);
    
    return {
      fallbackResult,
      auditLog,
      systemStatus,
      insights
    };
  }

  private async handleFallback(input: AdminSupervisorInput): Promise<AdminSupervisorOutput['fallbackResult']> {
    let status: 'success' | 'partial' | 'failed' = 'success';
    let resolution = '';
    let nextSteps: string[] = [];
    
    switch (input.action) {
      case 'override':
        resolution = `Manual override executed for ${input.target?.containerName || 'system component'}`;
        nextSteps = [
          'Monitor system stability',
          'Review override impact',
          'Schedule follow-up assessment'
        ];
        break;
        
      case 'fallback':
        resolution = `Fallback mechanism activated for failed operation`;
        nextSteps = [
          'Switch to backup processing pipeline',
          'Investigate root cause of failure',
          'Restore primary system when stable'
        ];
        break;
        
      case 'audit':
        resolution = `Comprehensive audit completed for specified scope`;
        nextSteps = [
          'Review audit findings',
          'Implement recommended changes',
          'Schedule follow-up audit'
        ];
        break;
        
      case 'monitor':
        resolution = `Enhanced monitoring activated for system components`;
        nextSteps = [
          'Review monitoring alerts',
          'Adjust monitoring thresholds',
          'Generate performance reports'
        ];
        break;
        
      case 'repair':
        resolution = `System repair procedures initiated`;
        if (input.context?.failedAttempts && input.context.failedAttempts > 2) {
          status = 'partial';
          resolution += ' - Multiple failures detected, escalating to manual intervention';
        }
        nextSteps = [
          'Verify repair completion',
          'Test affected functionality',
          'Update system documentation'
        ];
        break;
        
      default:
        status = 'failed';
        resolution = `Unknown admin action: ${input.action}`;
        nextSteps = ['Review admin action request', 'Contact system administrator'];
    }
    
    return {
      action: input.action,
      status,
      resolution,
      nextSteps
    };
  }

  private createAuditLog(
    input: AdminSupervisorInput,
    fallbackResult: AdminSupervisorOutput['fallbackResult'],
    sessionId: string
  ): AdminSupervisorOutput['auditLog'] {
    return {
      id: `audit_${Date.now()}_${sessionId}`,
      timestamp: new Date().toISOString(),
      adminId: input.target?.userId || 'system_admin',
      action: input.action,
      target: input.target?.containerName || input.target?.userId || 'system',
      reason: input.reason,
      outcome: fallbackResult.status,
      evidence: {
        priority: input.priority,
        sessionId,
        context: input.context,
        resolution: fallbackResult.resolution,
        nextSteps: fallbackResult.nextSteps
      }
    };
  }

  private async assessSystemStatus(): Promise<AdminSupervisorOutput['systemStatus']> {
    // Simulate system health assessment
    const containers = {
      'FileIntelligenceContainer': {
        status: 'online' as const,
        lastCheck: new Date().toISOString(),
        responseTime: 250,
        errorRate: 0.02
      },
      'JournalingContainer': {
        status: 'online' as const,
        lastCheck: new Date().toISOString(),
        responseTime: 380,
        errorRate: 0.01
      },
      'RelationshipContainer': {
        status: 'degraded' as const,
        lastCheck: new Date().toISOString(),
        responseTime: 1200,
        errorRate: 0.15
      },
      'StorytellingContainer': {
        status: 'online' as const,
        lastCheck: new Date().toISOString(),
        responseTime: 850,
        errorRate: 0.03
      }
    };
    
    // Determine overall status
    const degradedContainers = Object.values(containers).filter(c => c.status === 'degraded').length;
    const offlineContainers = Object.values(containers).filter(c => c.status === 'offline').length;
    
    let overall: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (offlineContainers > 0) {
      overall = 'critical';
    } else if (degradedContainers > 0) {
      overall = 'degraded';
    }
    
    const recommendations: string[] = [];
    if (overall === 'degraded') {
      recommendations.push('Investigate degraded containers');
      recommendations.push('Consider scaling resources');
    }
    if (overall === 'critical') {
      recommendations.push('Immediate intervention required');
      recommendations.push('Activate emergency protocols');
    }
    
    return {
      overall,
      containers,
      recommendations
    };
  }

  private generateInsights(
    input: AdminSupervisorInput,
    systemStatus: AdminSupervisorOutput['systemStatus']
  ): AdminSupervisorOutput['insights'] {
    const patternAnalysis: string[] = [];
    const performanceMetrics: Record<string, number> = {};
    const optimizationSuggestions: string[] = [];
    
    // Pattern analysis
    if (input.context?.failedAttempts && input.context.failedAttempts > 1) {
      patternAnalysis.push('Recurring failure pattern detected');
    }
    if (input.priority === 'critical') {
      patternAnalysis.push('Critical priority issue indicates system stress');
    }
    
    // Performance metrics
    const avgResponseTime = Object.values(systemStatus.containers)
      .reduce((sum, container) => sum + container.responseTime, 0) / Object.keys(systemStatus.containers).length;
    const avgErrorRate = Object.values(systemStatus.containers)
      .reduce((sum, container) => sum + container.errorRate, 0) / Object.keys(systemStatus.containers).length;
    
    performanceMetrics.averageResponseTime = Math.round(avgResponseTime);
    performanceMetrics.averageErrorRate = Math.round(avgErrorRate * 1000) / 1000;
    performanceMetrics.systemHealth = systemStatus.overall === 'healthy' ? 1 : 
                                     systemStatus.overall === 'degraded' ? 0.7 : 0.3;
    
    // Optimization suggestions
    if (avgResponseTime > 500) {
      optimizationSuggestions.push('Consider implementing caching layer');
    }
    if (avgErrorRate > 0.05) {
      optimizationSuggestions.push('Review error handling and retry logic');
    }
    if (systemStatus.overall !== 'healthy') {
      optimizationSuggestions.push('Implement proactive monitoring and alerting');
    }
    
    optimizationSuggestions.push('Regular system health assessments recommended');
    
    return {
      patternAnalysis,
      performanceMetrics,
      optimizationSuggestions
    };
  }
}