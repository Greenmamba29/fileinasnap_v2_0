import { isFeatureEnabled } from './planManager';
import { PlanName } from './plans';

export interface AgentInvocationRecord {
  agentName: string;
  timestamp: string;
  durationMs: number;
  success: boolean;
  errorMessage?: string;
}

export interface AnalyticsSummary {
  totalInvocations: number;
  successRate: number;
  averageDurationMs: number;
  agentBreakdown: Record<string, { count: number; successRate: number }>;
}

const invocationHistory: AgentInvocationRecord[] = [];

/**
 * Record an agent invocation.  In a real implementation this would write
 * to Supabase or another analytics store.  Here it simply pushes into an
 * in‑memory array.
 */
export function logAgentInvocation(record: AgentInvocationRecord) {
  invocationHistory.push(record);
}

/**
 * Compute summary analytics across all recorded agent invocations.  Analytics
 * are only available to enterprise plans.  Other plans should not call
 * this function and should handle authorization at the API layer.
 */
export function getAnalyticsSummary(planName: PlanName): AnalyticsSummary {
  if (!isFeatureEnabled(planName, 'analytics')) {
    throw new Error('Analytics is only available on the Enterprise plan.');
  }
  const total = invocationHistory.length;
  const successes = invocationHistory.filter((r) => r.success).length;
  const durations = invocationHistory.map((r) => r.durationMs);
  const averageDuration = durations.reduce((a, b) => a + b, 0) / (durations.length || 1);
  const breakdown: Record<string, { count: number; successRate: number }> = {};
  invocationHistory.forEach((r) => {
    const entry = breakdown[r.agentName] || { count: 0, successRate: 0 };
    entry.count += 1;
    // success rate per agent recalculated later
    breakdown[r.agentName] = entry;
  });
  Object.keys(breakdown).forEach((agent) => {
    const totalForAgent = invocationHistory.filter((r) => r.agentName === agent);
    const successForAgent = totalForAgent.filter((r) => r.success).length;
    breakdown[agent].successRate = totalForAgent.length ? successForAgent / totalForAgent.length : 0;
  });
  return {
    totalInvocations: total,
    successRate: total ? successes / total : 0,
    averageDurationMs: averageDuration,
    agentBreakdown: breakdown,
  };
}
