import { isFeatureEnabled } from './planManager';
import { PlanName } from './plans';

export type StoryType =
  | 'seasonalChronicles'
  | 'relationshipJourneys'
  | 'achievementStories'
  | 'travelAdventures'
  | 'familySagas'
  | 'memoryTriggers';

export interface StoryRequest {
  type: StoryType;
  files: string[]; // IDs of files to include
  people?: string[]; // optional people IDs
  notes?: string;
}

export interface StorySummary {
  title: string;
  narrative: string;
  highlights: string[];
}

/**
 * The Story Agent compiles selected memories into narrative outputs based on
 * predefined story types.  Story modules are only available on Veteran and
 * Enterprise plans.  The agent accepts a list of file IDs and optional
 * notes to craft a personalised story summary.
 */
export async function storyAgent(
  planName: PlanName,
  request: StoryRequest,
): Promise<StorySummary> {
  if (!isFeatureEnabled(planName, 'storyModules')) {
    throw new Error('Story modules are not enabled for this plan.');
  }

  // --- AI Processing Stubs ---
  // In practice this would use a narrative generation model to weave a
  // cohesive story around uploaded files and annotated relationships.
  const titleMap: Record<StoryType, string> = {
    seasonalChronicles: 'A Season to Remember',
    relationshipJourneys: 'Our Journey Together',
    achievementStories: 'Milestone Moments',
    travelAdventures: 'Around the World',
    familySagas: 'Family Ties',
    memoryTriggers: 'Moments That Matter',
  };
  const title = titleMap[request.type];
  const narrative = `Your story titled "${title}" includes ${request.files.length} memories.`;
  const highlights = request.files.map((id) => `Memory ${id}`);
  return { title, narrative, highlights };
}
