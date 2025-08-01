import { isFeatureEnabled, checkQuota } from './planManager';
import { PlanName } from './plans';

// Stub types for file metadata and AI result
export interface FileUpload {
  id: string;
  name: string;
  sizeMb: number;
  mimeType: string;
  content: Buffer;
}

export interface FileMetadata {
  newName: string;
  tags: string[];
  summary: string;
  confidenceScore: number;
  clarityScore: number;
  priorityScore: number;
  suggestedDestination: string;
}

/**
 * The File Organizer Agent handles renaming, tagging, summarizing and scoring of
 * uploaded files.  This function is intended to be called by the orchestration
 * layer (Make.com) after a file has been stored in Supabase.  It checks
 * whether the current plan has the `fileIntelligence` feature before
 * performing any work.  Quotas should be enforced at a higher level, but
 * optional quota checks are provided for completeness.
 */
export async function fileOrganizerAgent(
  planName: PlanName,
  file: FileUpload,
  currentStorageMb: number,
  currentUploadsThisMonth: number,
): Promise<FileMetadata> {
  // Ensure the organization has file intelligence enabled
  if (!isFeatureEnabled(planName, 'fileIntelligence')) {
    throw new Error('File intelligence feature is not enabled for this plan.');
  }

  // Optional quota checks (could be enforced centrally by orchestrator)
  if (!checkQuota(planName, 'storage', currentStorageMb, file.sizeMb)) {
    throw new Error('Storage quota exceeded');
  }
  if (!checkQuota(planName, 'uploads', currentUploadsThisMonth)) {
    throw new Error('Monthly upload quota exceeded');
  }

  // --- AI Processing Stubs ---
  // In a real implementation these calls would be replaced with LLM/API
  // invocations (e.g. calling OpenAI, Gemini or an internal model) to
  // generate a smart file name, tags, summary and scores.  Here we use
  // simplistic placeholders.
  const generatedName = `Smart_${file.name.replace(/\s+/g, '_')}`;
  const tags = [`tag-${file.mimeType.split('/')[0]}`];
  const summary = `This is an auto‑generated summary of ${file.name}.`;
  const confidenceScore = Math.random();
  const clarityScore = Math.random();
  const priorityScore = Math.random();
  const suggestedDestination = 'Default Folder';

  return {
    newName: generatedName,
    tags,
    summary,
    confidenceScore,
    clarityScore,
    priorityScore,
    suggestedDestination,
  };
}
