import { isFeatureEnabled } from './planManager';
import { PlanName } from './plans';

export interface JournalEntry {
  id: string;
  content: string;
  createdAt: string;
  voiceRecordingUrl?: string;
}

export interface JournalAnalysis {
  summary: string;
  emotions: Record<string, number>;
  extractedFiles: Array<{ name: string; link: string }>;
  recommendedDestination: string;
}

/**
 * The Journal Agent processes free‑text journal entries or uploaded documents.
 * It summarises content, detects emotions, extracts file references and
 * recommends a storage destination.  If the plan does not include the
 * journaling feature the function throws an error.  Journaling features are
 * available on Pro, Veteran and Enterprise plans.
 */
export async function journalAgent(
  planName: PlanName,
  entry: JournalEntry,
): Promise<JournalAnalysis> {
  if (!isFeatureEnabled(planName, 'journaling')) {
    throw new Error('Journaling feature is not enabled for this plan.');
  }

  // --- AI Processing Stubs ---
  // Real implementations would call a text analysis model to produce a
  // summary, detect emotions (e.g. joy, sadness, anger), parse out file
  // references/links and suggest a destination.  Here we use simple
  // heuristics for demonstration purposes.
  const summary = entry.content.slice(0, 100) + '…';
  const emotions = { neutral: 0.8, joy: 0.1, sadness: 0.1 };
  const extractedFiles = [];
  const recommendedDestination = 'Journal Stream';

  return { summary, emotions, extractedFiles, recommendedDestination };
}
