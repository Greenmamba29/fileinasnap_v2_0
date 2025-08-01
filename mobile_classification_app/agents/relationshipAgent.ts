import { isFeatureEnabled } from './planManager';
import { PlanName } from './plans';

export interface PersonDetection {
  id: string;
  faceId: string;
  name?: string;
  relationship?: string;
}

export interface RelationshipResult {
  people: PersonDetection[];
  groups: Record<string, string[]>; // relationship groups, e.g. family, friends
}

/**
 * The Relationship Agent performs face detection and relationship mapping on
 * uploaded photos or videos.  It identifies known individuals and clusters
 * them into relationship categories.  This feature is only available on
 * Veteran and Enterprise plans.
 */
export async function relationshipAgent(
  planName: PlanName,
  imageBuffer: Buffer,
): Promise<RelationshipResult> {
  if (!isFeatureEnabled(planName, 'relationship')) {
    throw new Error('Relationship and face recognition feature is not enabled for this plan.');
  }

  // --- AI Processing Stubs ---
  // In reality this would call a computer vision model to detect faces and
  // then match them against user‑provided galleries, building a relationship
  // graph.  Here we simulate a single anonymous face.
  const people: PersonDetection[] = [
    {
      id: 'face-1',
      faceId: '0001',
    },
  ];
  const groups: Record<string, string[]> = {};
  return { people, groups };
}
