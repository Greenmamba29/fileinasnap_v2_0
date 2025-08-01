/**
 * This module defines subscription plans for the Mobile Classification App.
 * Each plan specifies which features are enabled and resource limits.  These
 * definitions power the PlanManager and gate functionality in individual
 * agents.  Updating this file will automatically affect feature availability
 * throughout the application.  Plans follow a simple Good‑Better‑Best
 * progression: Standard → Pro → Veteran → Enterprise.
 */

export type PlanName = 'standard' | 'pro' | 'veteran' | 'enterprise';

export interface PlanFeatures {
  /** Core file intelligence including renaming, tagging and routing */
  fileIntelligence: boolean;
  /** Journaling and memory therapy tools */
  journaling: boolean;
  /** Relationship and face recognition */
  relationship: boolean;
  /** Story modules such as Seasonal Chronicles and Relationship Journeys */
  storyModules: boolean;
  /** Access to advanced analytics and admin dashboards */
  analytics: boolean;
  /** Premium support and custom integrations */
  premiumSupport: boolean;
}

export interface PlanLimits {
  /** Maximum storage quota in megabytes */
  maxStorageMb: number;
  /** Maximum number of file uploads per month */
  maxMonthlyUploads: number;
  /** Maximum number of users allowed in an organization */
  maxUsers: number;
}

export interface PlanDefinition {
  name: PlanName;
  features: PlanFeatures;
  limits: PlanLimits;
  /** Human friendly description for marketing pages */
  description: string;
  /** Monthly price in USD (0 for free plans) */
  pricePerMonth: number;
}

/**
 * Definitions for each subscription plan.  These objects are immutable and
 * should be referenced via the PlanManager rather than mutated directly.
 */
export const PLANS: Record<PlanName, PlanDefinition> = {
  standard: {
    name: 'standard',
    description: 'Basic plan with core file intelligence features.',
    pricePerMonth: 9,
    features: {
      fileIntelligence: true,
      journaling: false,
      relationship: false,
      storyModules: false,
      analytics: false,
      premiumSupport: false,
    },
    limits: {
      maxStorageMb: 5_000, // 5 GB
      maxMonthlyUploads: 200,
      maxUsers: 3,
    },
  },
  pro: {
    name: 'pro',
    description: 'Professional plan adding journaling and memory therapy.',
    pricePerMonth: 19,
    features: {
      fileIntelligence: true,
      journaling: true,
      relationship: false,
      storyModules: false,
      analytics: false,
      premiumSupport: false,
    },
    limits: {
      maxStorageMb: 20_000, // 20 GB
      maxMonthlyUploads: 1_000,
      maxUsers: 10,
    },
  },
  veteran: {
    name: 'veteran',
    description:
      'Advanced plan with relationship recognition and story modules.',
    pricePerMonth: 49,
    features: {
      fileIntelligence: true,
      journaling: true,
      relationship: true,
      storyModules: true,
      analytics: false,
      premiumSupport: false,
    },
    limits: {
      maxStorageMb: 50_000, // 50 GB
      maxMonthlyUploads: 5_000,
      maxUsers: 50,
    },
  },
  enterprise: {
    name: 'enterprise',
    description:
      'Unlimited plan with analytics, story modules, relationship recognition and premium support.',
    pricePerMonth: 149,
    features: {
      fileIntelligence: true,
      journaling: true,
      relationship: true,
      storyModules: true,
      analytics: true,
      premiumSupport: true,
    },
    limits: {
      maxStorageMb: Infinity,
      maxMonthlyUploads: Infinity,
      maxUsers: Infinity,
    },
  },
};
