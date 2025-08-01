/**
 * PlanManager centralizes subscription plan lookup and feature gating logic.
 * It imports plan definitions and exposes helper functions for checking
 * whether a particular feature is available on a given plan.  Agents
 * should import and use these functions before performing work to ensure
 * compliance with pricing tiers.
 */

import { PlanName, PlanDefinition, PLANS } from './plans';

/**
 * Retrieve a plan definition by its name.  Throws if the plan does not exist.
 */
export function getPlan(planName: PlanName): PlanDefinition {
  const plan = PLANS[planName];
  if (!plan) {
    throw new Error(`Unknown plan: ${planName}`);
  }
  return plan;
}

/**
 * Determine whether a given feature is enabled for a plan.
 *
 * @param planName - The name of the current subscription plan.
 * @param feature - The feature being requested.
 */
export function isFeatureEnabled(
  planName: PlanName,
  feature: keyof PlanDefinition['features'],
): boolean {
  const plan = getPlan(planName);
  return plan.features[feature];
}

/**
 * Check whether an organization has capacity to perform an action based on its limits.
 * Each agent can call this before starting a resource‑intensive operation.
 *
 * @param planName - The organization’s subscription plan.
 * @param type - The type of action (e.g. 'upload', 'storage').
 * @param currentValue - The current usage for the given action.
 * @param increment - The amount of usage to add.
 */
export function checkQuota(
  planName: PlanName,
  type: 'storage' | 'uploads' | 'users',
  currentValue: number,
  increment: number = 1,
): boolean {
  const plan = getPlan(planName);
  switch (type) {
    case 'storage':
      return currentValue + increment <= plan.limits.maxStorageMb;
    case 'uploads':
      return currentValue + increment <= plan.limits.maxMonthlyUploads;
    case 'users':
      return currentValue + increment <= plan.limits.maxUsers;
    default:
      return false;
  }
}
