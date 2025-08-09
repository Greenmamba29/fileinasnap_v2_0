/**
 * FileInASnap Agent Container Definitions
 * 
 * This file defines the specific agent containers and their trigger flows
 * as specified in the user flow architecture.
 */

export interface AgentOutput {
  agentName: string;
  planUsed: string;
  llmModel: string;
  outputs: Record<string, any>;
  processingTime: number;
  success: boolean;
  timestamp: string;
}

export interface ContainerConfig {
  name: string;
  triggers: string[];
  planRequirement?: string;
  llmModel: string;
  outputSchema: string[];
  actions?: string[];
}

/**
 * FileOrganizer Container
 * Triggered by: [Upload File]
 * Plan: Standard+
 * LLM: Groq (Standard), Gemini (Pro+), Claude (Veteran+)
 * Outputs: tags, folder, confidence
 */
export const FileOrganizerContainer: ContainerConfig = {
  name: 'FileOrganizerContainer',
  triggers: ['file.uploaded', 'file.drag_drop', 'file.api_upload'],
  planRequirement: 'standard', // minimum plan
  llmModel: 'groq-llama3', // default for Standard
  outputSchema: ['tags', 'folder', 'confidence'],
};

/**
 * JournalAgent Container  
 * Triggered by: [Journal Entry]
 * Plan: Pro+
 * LLM: Gemini (Pro), Claude (Veteran+)
 * Outputs: todos, summary, destination
 */
export const JournalAgentContainer: ContainerConfig = {
  name: 'JournalAgentContainer', 
  triggers: ['journal.created', 'journal.voice_recorded', 'journal.text_input'],
  planRequirement: 'pro', // requires Pro or higher
  llmModel: 'gemini-1.5-pro', // default for Pro
  outputSchema: ['todos', 'summary', 'destination'],
};

/**
 * AgentSupervisor Container
 * Triggered by: [Override Panel]
 * Plan: Admin (Special admin access)
 * LLM: GPT-4o
 * Actions: fallback handling, logs, audits
 */
export const AgentSupervisor: ContainerConfig = {
  name: 'AgentSupervisor',
  triggers: ['admin.override_panel', 'admin.manual_intervention', 'system.fallback_required'],
  planRequirement: 'admin', // special admin plan
  llmModel: 'gpt-4o',
  outputSchema: ['fallback_result', 'audit_log', 'system_status'],
  actions: ['fallback_handling', 'logs', 'audits']
};

/**
 * Container Registry mapping triggers to containers
 */
export const ContainerRegistry = {
  // File upload triggers
  'file.uploaded': FileOrganizerContainer,
  'file.drag_drop': FileOrganizerContainer,
  'file.api_upload': FileOrganizerContainer,
  
  // Journal triggers
  'journal.created': JournalAgentContainer,
  'journal.voice_recorded': JournalAgentContainer,
  'journal.text_input': JournalAgentContainer,
  
  // Admin override triggers
  'admin.override_panel': AgentSupervisor,
  'admin.manual_intervention': AgentSupervisor,
  'system.fallback_required': AgentSupervisor,
};

/**
 * Plan-based LLM model selection
 */
export const PlanLLMMapping = {
  // FileOrganizer LLM by plan
  fileOrganizer: {
    'standard': 'groq-llama3',
    'pro': 'gemini-1.5-pro', 
    'creator': 'gpt-4',
    'veteran': 'claude-3-sonnet',
    'enterprise': 'claude-3-opus'
  },
  
  // JournalAgent LLM by plan
  journalAgent: {
    'pro': 'gemini-1.5-pro',
    'creator': 'gpt-4',
    'veteran': 'claude-3-sonnet', 
    'enterprise': 'claude-3-opus'
  },
  
  // AgentSupervisor always uses GPT-4o
  agentSupervisor: {
    'admin': 'gpt-4o',
    'enterprise': 'gpt-4o' // Enterprise users can access supervisor
  }
};

/**
 * Execute FileOrganizer Container
 */
export async function executeFileOrganizerContainer(
  trigger: string,
  planName: string,
  fileData: any
): Promise<AgentOutput> {
  const startTime = Date.now();
  
  // Select LLM based on plan
  const llmModel = PlanLLMMapping.fileOrganizer[planName] || 'groq-llama3';
  
  try {
    // Simulate file processing with plan-appropriate intelligence
    const result = await processFileWithLLM(fileData, llmModel, planName);
    
    return {
      agentName: 'FileOrganizerContainer',
      planUsed: planName,
      llmModel: llmModel,
      outputs: {
        tags: result.tags,
        folder: result.suggestedFolder,
        confidence: result.confidenceScore
      },
      processingTime: Date.now() - startTime,
      success: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      agentName: 'FileOrganizerContainer',
      planUsed: planName,
      llmModel: llmModel,
      outputs: {},
      processingTime: Date.now() - startTime,
      success: false,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Execute JournalAgent Container
 */
export async function executeJournalAgentContainer(
  trigger: string,
  planName: string, 
  journalData: any
): Promise<AgentOutput> {
  const startTime = Date.now();
  
  // Require Pro+ plan
  if (!['pro', 'creator', 'veteran', 'enterprise'].includes(planName)) {
    throw new Error('JournalAgent requires Pro plan or higher');
  }
  
  const llmModel = PlanLLMMapping.journalAgent[planName] || 'gemini-1.5-pro';
  
  try {
    const result = await processJournalWithLLM(journalData, llmModel, planName);
    
    return {
      agentName: 'JournalAgentContainer',
      planUsed: planName,
      llmModel: llmModel,
      outputs: {
        todos: result.extractedTodos,
        summary: result.aiSummary,
        destination: result.recommendedFolder
      },
      processingTime: Date.now() - startTime,
      success: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      agentName: 'JournalAgentContainer', 
      planUsed: planName,
      llmModel: llmModel,
      outputs: {},
      processingTime: Date.now() - startTime,
      success: false,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Execute AgentSupervisor Container
 */
export async function executeAgentSupervisor(
  trigger: string,
  planName: string,
  adminData: any
): Promise<AgentOutput> {
  const startTime = Date.now();
  
  // Require admin access or enterprise plan
  if (!['admin', 'enterprise'].includes(planName)) {
    throw new Error('AgentSupervisor requires admin access or Enterprise plan');
  }
  
  const llmModel = 'gpt-4o'; // Always GPT-4o for supervisor
  
  try {
    const result = await executeAdminAction(adminData, llmModel, trigger);
    
    return {
      agentName: 'AgentSupervisor',
      planUsed: planName,
      llmModel: llmModel,
      outputs: {
        fallback_result: result.fallbackAction,
        audit_log: result.auditEntry,
        system_status: result.systemHealth
      },
      processingTime: Date.now() - startTime,
      success: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      agentName: 'AgentSupervisor',
      planUsed: planName,
      llmModel: llmModel,
      outputs: {},
      processingTime: Date.now() - startTime,
      success: false,
      timestamp: new Date().toISOString()
    };
  }
}

// Simulation functions for LLM processing
async function processFileWithLLM(fileData: any, llmModel: string, plan: string) {
  // Simulate different intelligence levels by plan
  const intelligenceLevel = {
    'standard': 1,
    'pro': 2, 
    'creator': 2.5,
    'veteran': 3,
    'enterprise': 4
  }[plan] || 1;
  
  return {
    tags: generateTagsByIntelligence(fileData, intelligenceLevel),
    suggestedFolder: generateFolderByIntelligence(fileData, intelligenceLevel),
    confidenceScore: 0.5 + (intelligenceLevel * 0.1)
  };
}

async function processJournalWithLLM(journalData: any, llmModel: string, plan: string) {
  return {
    extractedTodos: extractTodosFromJournal(journalData.content),
    aiSummary: generateSummary(journalData.content, llmModel),
    recommendedFolder: 'Journal/' + new Date().getFullYear()
  };
}

async function executeAdminAction(adminData: any, llmModel: string, trigger: string) {
  return {
    fallbackAction: `Executed ${trigger} with GPT-4o`,
    auditEntry: {
      action: trigger,
      timestamp: new Date().toISOString(),
      model: llmModel,
      success: true
    },
    systemHealth: 'All systems operational'
  };
}

// Helper functions
function generateTagsByIntelligence(fileData: any, level: number): string[] {
  const baseTags = [fileData.mimeType?.split('/')[0] || 'file'];
  
  if (level >= 2) baseTags.push('ai-processed');
  if (level >= 3) baseTags.push('semantic-analyzed');
  if (level >= 4) baseTags.push('enterprise-grade');
  
  return baseTags;
}

function generateFolderByIntelligence(fileData: any, level: number): string {
  if (level >= 3) return 'Smart/AI-Organized/' + new Date().getFullYear();
  if (level >= 2) return 'Organized/' + (fileData.mimeType?.split('/')[0] || 'files');
  return 'Uploads';
}

function extractTodosFromJournal(content: string): string[] {
  // Simple todo extraction simulation
  const todos = [];
  if (content.toLowerCase().includes('need to') || content.toLowerCase().includes('should')) {
    todos.push('Follow up on journal items');
  }
  if (content.toLowerCase().includes('remember') || content.toLowerCase().includes('don\'t forget')) {
    todos.push('Review important memories');
  }
  return todos;
}

function generateSummary(content: string, llmModel: string): string {
  return `${llmModel} generated summary: ${content.substring(0, 100)}...`;
}