/**
 * Admin Dashboard - Lovable Connected Component
 * Enterprise-level system monitoring and control interface
 */

import React, { useState, useEffect } from 'react';
import { PlanName, hasFeature, getPricingTier } from '../../pricingConfig';

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  containers: Record<string, {
    status: 'online' | 'offline' | 'degraded';
    lastCheck: string;
    responseTime: number;
    errorRate: number;
  }>;
  recommendations: string[];
}

interface AdminAlert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  containerName?: string;
  timestamp: string;
  resolved: boolean;
}

interface AdminDashboardProps {
  planName: PlanName;
  onContainerOverride?: (containerName: string, reason: string) => void;
  onSystemAudit?: () => void;
  onFallbackTrigger?: (containerName: string) => void;
  className?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  planName,
  onContainerOverride,
  onSystemAudit,
  onFallbackTrigger,
  className = '',
}) => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState<false>(false);
  
  const planInfo = getPricingTier(planName);
  
  // Check admin access
  const hasAdminAccess = planName === 'enterprise' || planName === 'admin';
  const hasAuditTrail = hasFeature(planName, 'auditTrail');
  const hasFallbackAnalytics = hasFeature(planName, 'fallbackAnalytics');

  // Simulate system health monitoring
  useEffect(() => {
    if (hasAdminAccess) {
      const interval = setInterval(() => {
        fetchSystemHealth();
        fetchAlerts();
      }, 5000);
      
      // Initial fetch
      fetchSystemHealth();
      fetchAlerts();
      
      return () => clearInterval(interval);
    }
  }, [hasAdminAccess]);

  const fetchSystemHealth = async () => {
    // Simulate API call to get system health
    const mockHealth: SystemHealth = {
      overall: Math.random() > 0.8 ? 'degraded' : 'healthy',
      containers: {
        'FileIntelligenceContainer': {
          status: 'online',
          lastCheck: new Date().toISOString(),
          responseTime: 200 + Math.random() * 100,
          errorRate: Math.random() * 0.05,
        },
        'JournalingContainer': {
          status: Math.random() > 0.9 ? 'degraded' : 'online',
          lastCheck: new Date().toISOString(),
          responseTime: 350 + Math.random() * 200,
          errorRate: Math.random() * 0.1,
        },
        'RelationshipContainer': {
          status: Math.random() > 0.95 ? 'offline' : 'online',
          lastCheck: new Date().toISOString(),
          responseTime: 800 + Math.random() * 400,
          errorRate: Math.random() * 0.15,
        },
        'StorytellingContainer': {
          status: 'online',
          lastCheck: new Date().toISOString(),
          responseTime: 600 + Math.random() * 300,
          errorRate: Math.random() * 0.08,
        },
        'AdminSupervisorContainer': {
          status: 'online',
          lastCheck: new Date().toISOString(),
          responseTime: 150 + Math.random() * 50,
          errorRate: Math.random() * 0.02,
        },
      },
      recommendations: []
    };
    
    // Generate recommendations based on health
    if (Object.values(mockHealth.containers).some(c => c.status === 'degraded')) {
      mockHealth.recommendations.push('Investigate degraded containers');
    }
    if (Object.values(mockHealth.containers).some(c => c.errorRate > 0.1)) {
      mockHealth.recommendations.push('Review error handling mechanisms');
    }
    
    setSystemHealth(mockHealth);
  };

  const fetchAlerts = async () => {
    // Simulate fetching alerts
    const mockAlerts: AdminAlert[] = [
      {
        id: 'alert_1',
        level: 'warning',
        message: 'RelationshipContainer response time above threshold',
        containerName: 'RelationshipContainer',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        resolved: false,
      },
      {
        id: 'alert_2',
        level: 'info',
        message: 'System health check completed successfully',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        resolved: false,
      },
    ];
    
    setAlerts(mockAlerts);
  };

  const handleContainerOverride = async () => {
    if (selectedContainer && overrideReason && onContainerOverride) {
      setIsLoading(true);
      try {
        await onContainerOverride(selectedContainer, overrideReason);
        setSelectedContainer('');
        setOverrideReason('');
        // Add success alert
        const newAlert: AdminAlert = {
          id: `alert_${Date.now()}`,
          level: 'info',
          message: `Override executed for ${selectedContainer}`,
          containerName: selectedContainer,
          timestamp: new Date().toISOString(),
          resolved: false,
        };
        setAlerts(prev => [newAlert, ...prev]);
      } catch (error) {
        console.error('Override failed:', error);
      }
      setIsLoading(false);
    }
  };

  const handleSystemAudit = async () => {
    if (onSystemAudit) {
      setIsLoading(true);
      try {
        await onSystemAudit();
        const newAlert: AdminAlert = {
          id: `alert_${Date.now()}`,
          level: 'info',
          message: 'System audit initiated',
          timestamp: new Date().toISOString(),
          resolved: false,
        };
        setAlerts(prev => [newAlert, ...prev]);
      } catch (error) {
        console.error('Audit failed:', error);
      }
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertColor = (level: string): string => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAlertIcon = (level: string): string => {
    switch (level) {
      case 'critical': return '🔴';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  // Access control check
  if (!hasAdminAccess) {
    return (
      <div className={`admin-dashboard-upgrade ${className}`}>
        <div className="upgrade-prompt bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Admin Dashboard</h3>
          <p className="text-gray-600 mb-4">
            System monitoring, container overrides, and audit controls
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Available on Enterprise plan only
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
            Upgrade to Enterprise - $149/month
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard ${className}`}>
      {/* Dashboard Header */}
      <div className="dashboard-header mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">
              {planInfo.name} Plan • GPT-4o Administrative Intelligence
            </p>
          </div>
          
          <div className="admin-actions flex space-x-3">
            <button
              onClick={handleSystemAudit}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>System Audit</span>
            </button>
            
            <div className="status-indicator flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                systemHealth?.overall === 'healthy' ? 'bg-green-500' :
                systemHealth?.overall === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm font-medium">
                {systemHealth?.overall?.charAt(0).toUpperCase() + systemHealth?.overall?.slice(1) || 'Loading...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Health Overview */}
        <div className="system-health lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Container Health</h2>
            
            {systemHealth ? (
              <div className="containers-grid space-y-4">
                {Object.entries(systemHealth.containers).map(([name, status]) => (
                  <div key={name} className="container-status bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status.status)}`}>
                          {status.status.toUpperCase()}
                        </span>
                        <h3 className="font-medium text-gray-800">{name}</h3>
                      </div>
                      
                      <div className="container-actions flex space-x-2">
                        {status.status !== 'online' && (
                          <button
                            onClick={() => onFallbackTrigger && onFallbackTrigger(name)}
                            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                          >
                            Trigger Fallback
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="container-metrics grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Response Time</span>
                        <div className="font-medium">{Math.round(status.responseTime)}ms</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Error Rate</span>
                        <div className="font-medium">{(status.errorRate * 100).toFixed(2)}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Check</span>
                        <div className="font-medium">
                          {new Date(status.lastCheck).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="loading text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
                <p className="text-gray-500">Loading system health...</p>
              </div>
            )}
            
            {systemHealth?.recommendations && systemHealth.recommendations.length > 0 && (
              <div className="recommendations mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Recommendations</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {systemHealth.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Alerts & Controls */}
        <div className="admin-controls space-y-6">
          {/* Manual Override Panel */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Manual Override</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Container
                </label>
                <select
                  value={selectedContainer}
                  onChange={(e) => setSelectedContainer(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select container...</option>
                  {systemHealth && Object.keys(systemHealth.containers).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Describe the reason for override..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 resize-none"
                />
              </div>
              
              <button
                onClick={handleContainerOverride}
                disabled={!selectedContainer || !overrideReason || isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                {isLoading ? 'Executing...' : 'Execute Override'}
              </button>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Alerts</h3>
            
            {alerts.length > 0 ? (
              <div className="alerts-list space-y-3 max-h-80 overflow-y-auto">
                {alerts.slice(0, 10).map(alert => (
                  <div
                    key={alert.id}
                    className={`alert-item p-3 rounded-lg border ${getAlertColor(alert.level)}`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">{getAlertIcon(alert.level)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{alert.message}</p>
                        {alert.containerName && (
                          <p className="text-xs opacity-75">Container: {alert.containerName}</p>
                        )}
                        <p className="text-xs opacity-75">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};