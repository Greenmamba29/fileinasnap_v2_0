/**
 * BMAD Container Registry Types
 * Defines the core interfaces and base classes for all agent containers
 */

import { PlanName } from '../../pricingConfig';

export interface ContainerConfig {
  name: string;
  featureModule: string;
  triggers: string[];
  minimumPlan: PlanName;
  outputSchema: string[];
  description: string;
}

export interface ContainerOutput<T = any> {
  success: boolean;
  output?: T;
  error?: string;
  processingTime: number;
  planUsed: PlanName;
  containerName: string;
  sessionId?: string;
}

export abstract class ContainerBase {
  static readonly config: ContainerConfig;
  
  abstract execute(
    planName: PlanName,
    input: any,
    sessionId: string
  ): Promise<ContainerOutput>;

  protected log(message: string, sessionId?: string): void {
    const timestamp = new Date().toISOString();
    const session = sessionId ? `[${sessionId}]` : '';
    const container = `[${this.constructor.name}]`;
    console.log(`${timestamp} ${container} ${session} ${message}`);
  }

  protected validatePlan(planName: PlanName, minimumPlan: PlanName): void {
    const planLevels = {
      'standard': 1,
      'pro': 2, 
      'creator': 2.5,
      'veteran': 3,
      'enterprise': 4,
      'admin': 5
    };
    
    const currentLevel = planLevels[planName] || 0;
    const requiredLevel = planLevels[minimumPlan] || 0;
    
    if (currentLevel < requiredLevel) {
      throw new Error(`${this.constructor.name} requires ${minimumPlan} plan or higher. Current plan: ${planName}`);
    }
  }
}

export interface FeatureModule {
  name: string;
  description: string;
  containers: string[];
  minimumPlan: PlanName;
  capabilities: string[];
}