/**
 * Agent Supervisor - Administrative Oversight System
 * Provides system monitoring, fallback handling, and administrative controls
 */

import { AdminSupervisorContainer, AdminSupervisorInput } from '../bmad-containers/admin-supervisor/container';
import { PlanName } from '../pricingConfig';
import { 
  CONTAINER_REGISTRY,
  getAvailableContainers 
} from '../bmad-containers/registry';

interface SupervisorAlert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  containerName?: string;
  planName?: string;
  timestamp: string;
  resolved: boolean;
}

interface SystemMetrics {
  containersOnline: number;
  totalContainers: number;
  averageResponseTime: number;
  errorRate: number;
  lastUpdate: string;
}

export class AgentSupervisor {
  private alerts: SupervisorAlert[] = [];
  private sessionId: string;
  private supervisorContainer: AdminSupervisorContainer;
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.supervisorContainer = new AdminSupervisorContainer();
  }

  private generateSessionId(): string {
    return `supervisor_${Math.random().toString(36).substring(2, 15)}`;
  }

  private log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const prefix = `${timestamp} [SUPERVISOR] [${this.sessionId}]`;
    
    switch (level) {
      case 'error':
        console.error(`${prefix} 🚨 ${message}`);
        break;
      case 'warn':
        console.warn(`${prefix} ⚠️  ${message}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
    }
  }

  /**
   * Monitor system health across all containers
   */
  async monitorSystemHealth(): Promise<SystemMetrics> {
    this.log('🔍 Monitoring system health...');
    
    try {
      const input: AdminSupervisorInput = {
        id: `monitor_${Date.now()}`,
        action: 'monitor',
        reason: 'Routine system health check',
        priority: 'medium'
      };
      
      const result = await this.supervisorContainer.execute('enterprise', input, this.sessionId);
      
      if (result.success && result.output) {
        const systemStatus = result.output.systemStatus;
        
        const metrics: SystemMetrics = {
          containersOnline: Object.values(systemStatus.containers).filter(c => c.status === 'online').length,
          totalContainers: Object.keys(systemStatus.containers).length,
          averageResponseTime: Object.values(systemStatus.containers)
            .reduce((sum, c) => sum + c.responseTime, 0) / Object.keys(systemStatus.containers).length,
          errorRate: Object.values(systemStatus.containers)
            .reduce((sum, c) => sum + c.errorRate, 0) / Object.keys(systemStatus.containers).length,
          lastUpdate: new Date().toISOString()
        };
        
        this.log(`✅ Health check complete: ${metrics.containersOnline}/${metrics.totalContainers} containers online`);
        
        // Generate alerts for degraded containers
        Object.entries(systemStatus.containers).forEach(([name, status]) => {
          if (status.status === 'degraded') {
            this.addAlert('warning', `Container ${name} is degraded (${status.responseTime}ms response)`, name);
          } else if (status.status === 'offline') {
            this.addAlert('critical', `Container ${name} is offline`, name);
          }
        });
        
        return metrics;
      } else {
        throw new Error('Health monitoring failed');
      }
      
    } catch (error: any) {
      this.log(`❌ Health monitoring error: ${error.message}`, 'error');
      this.addAlert('error', `System health monitoring failed: ${error.message}`);
      
      return {
        containersOnline: 0,
        totalContainers: Object.keys(CONTAINER_REGISTRY).length,
        averageResponseTime: 0,
        errorRate: 1,
        lastUpdate: new Date().toISOString()
      };
    }
  }

  /**
   * Handle fallback scenarios when containers fail
   */
  async handleFallback(
    containerName: string,
    planName: PlanName,
    originalError: string,
    failedAttempts: number = 1
  ): Promise<void> {
    this.log(`🔄 Handling fallback for ${containerName} (Attempt: ${failedAttempts})`);
    
    try {
      const input: AdminSupervisorInput = {
        id: `fallback_${Date.now()}`,
        action: 'fallback',
        target: {
          containerName,
          planName
        },
        reason: `Container failure requiring fallback intervention`,
        priority: failedAttempts > 2 ? 'critical' : 'high',
        context: {
          originalError,
          failedAttempts,
          userImpact: 'Service degradation'
        }
      };
      
      const result = await this.supervisorContainer.execute('enterprise', input, this.sessionId);
      
      if (result.success && result.output) {
        const fallbackResult = result.output.fallbackResult;
        
        this.log(`✅ Fallback executed: ${fallbackResult.status} - ${fallbackResult.resolution}`);
        
        // Log next steps
        fallbackResult.nextSteps.forEach(step => {
          this.log(`   → ${step}`);
        });
        
        // Add alert based on fallback result
        const alertLevel = fallbackResult.status === 'success' ? 'info' : 
                          fallbackResult.status === 'partial' ? 'warning' : 'error';
        
        this.addAlert(alertLevel, `Fallback ${fallbackResult.status} for ${containerName}`, containerName, planName);
        
      } else {
        throw new Error('Fallback execution failed');
      }
      
    } catch (error: any) {
      this.log(`❌ Fallback handling error: ${error.message}`, 'error');
      this.addAlert('critical', `Fallback failed for ${containerName}: ${error.message}`, containerName, planName);
    }
  }

  /**
   * Perform administrative override
   */
  async performOverride(
    target: string,
    reason: string,
    planName: PlanName = 'enterprise'
  ): Promise<void> {
    this.log(`⚙️ Performing administrative override for: ${target}`);
    
    try {
      const input: AdminSupervisorInput = {
        id: `override_${Date.now()}`,
        action: 'override',
        target: { containerName: target },
        reason,
        priority: 'high'
      };
      
      const result = await this.supervisorContainer.execute(planName, input, this.sessionId);
      
      if (result.success && result.output) {
        this.log(`✅ Override completed: ${result.output.fallbackResult.resolution}`);
        this.addAlert('info', `Administrative override completed for ${target}`, target, planName);
      } else {
        throw new Error('Override execution failed');
      }
      
    } catch (error: any) {
      this.log(`❌ Override error: ${error.message}`, 'error');
      this.addAlert('error', `Override failed for ${target}: ${error.message}`, target, planName);
    }
  }

  /**
   * Generate comprehensive system audit
   */
  async performAudit(planName: PlanName = 'enterprise'): Promise<void> {
    this.log('📋 Performing comprehensive system audit...');
    
    try {
      const input: AdminSupervisorInput = {
        id: `audit_${Date.now()}`,
        action: 'audit',
        reason: 'Comprehensive system audit',
        priority: 'medium'
      };
      
      const result = await this.supervisorContainer.execute(planName, input, this.sessionId);
      
      if (result.success && result.output) {
        this.log(`✅ Audit completed: ${result.output.fallbackResult.resolution}`);
        
        // Display audit insights
        const insights = result.output.insights;
        console.log('\n📊 Audit Insights:');
        console.log('==================');
        
        console.log('\n🔍 Pattern Analysis:');
        insights.patternAnalysis.forEach(pattern => {
          console.log(`  • ${pattern}`);
        });
        
        console.log('\n📈 Performance Metrics:');
        Object.entries(insights.performanceMetrics).forEach(([metric, value]) => {
          console.log(`  • ${metric}: ${value}`);
        });
        
        console.log('\n💡 Optimization Suggestions:');
        insights.optimizationSuggestions.forEach(suggestion => {
          console.log(`  • ${suggestion}`);
        });
        
        this.addAlert('info', 'System audit completed successfully');
        
      } else {
        throw new Error('Audit execution failed');
      }
      
    } catch (error: any) {
      this.log(`❌ Audit error: ${error.message}`, 'error');
      this.addAlert('error', `System audit failed: ${error.message}`);
    }
  }

  /**
   * Add alert to the alert system
   */
  private addAlert(
    level: SupervisorAlert['level'],
    message: string,
    containerName?: string,
    planName?: string
  ): void {
    const alert: SupervisorAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      level,
      message,
      containerName,
      planName,
      timestamp: new Date().toISOString(),
      resolved: false
    };
    
    this.alerts.push(alert);
    
    // Log alert
    const logLevel = level === 'info' ? 'info' : level === 'warning' ? 'warn' : 'error';
    this.log(`🚨 ALERT [${level.toUpperCase()}]: ${message}`, logLevel);
  }

  /**
   * Get all alerts
   */
  getAlerts(includeResolved: boolean = false): SupervisorAlert[] {
    return includeResolved ? this.alerts : this.alerts.filter(a => !a.resolved);
  }

  /**
   * Resolve alert by ID
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      this.log(`✅ Alert resolved: ${alertId}`);
      return true;
    }
    return false;
  }

  /**
   * Clear all resolved alerts
   */
  clearResolvedAlerts(): number {
    const beforeCount = this.alerts.length;
    this.alerts = this.alerts.filter(a => !a.resolved);
    const clearedCount = beforeCount - this.alerts.length;
    
    if (clearedCount > 0) {
      this.log(`🧹 Cleared ${clearedCount} resolved alerts`);
    }
    
    return clearedCount;
  }

  /**
   * Display alert dashboard
   */
  displayAlertDashboard(): void {
    const alerts = this.getAlerts();
    
    console.log('\n🚨 Alert Dashboard');
    console.log('==================');
    
    if (alerts.length === 0) {
      console.log('✅ No active alerts');
      return;
    }
    
    const alertsByLevel = {
      critical: alerts.filter(a => a.level === 'critical'),
      error: alerts.filter(a => a.level === 'error'),
      warning: alerts.filter(a => a.level === 'warning'),
      info: alerts.filter(a => a.level === 'info')
    };
    
    Object.entries(alertsByLevel).forEach(([level, levelAlerts]) => {
      if (levelAlerts.length > 0) {
        const emoji = {
          critical: '🔴',
          error: '❌',
          warning: '⚠️',
          info: 'ℹ️'
        }[level];
        
        console.log(`\n${emoji} ${level.toUpperCase()} (${levelAlerts.length})`);
        levelAlerts.forEach(alert => {
          console.log(`  ${alert.id}: ${alert.message}`);
          if (alert.containerName) {
            console.log(`    Container: ${alert.containerName}`);
          }
          console.log(`    Time: ${new Date(alert.timestamp).toLocaleString()}`);
        });
      }
    });
  }

  /**
   * Get supervisor status summary
   */
  getStatus(): {
    sessionId: string;
    uptime: string;
    activeAlerts: number;
    lastHealthCheck: string;
  } {
    return {
      sessionId: this.sessionId,
      uptime: 'Active',
      activeAlerts: this.getAlerts().length,
      lastHealthCheck: new Date().toISOString()
    };
  }
}