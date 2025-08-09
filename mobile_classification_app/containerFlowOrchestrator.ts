#!/usr/bin/env node
/**
 * FileInASnap Container Flow Orchestrator
 * 
 * This orchestrator implements the specific agent container flow:
 * [Upload File] → [FileOrganizerContainer] → Plan: Standard, LLM: Groq, Outputs: tags, folder, confidence
 * [Journal Entry] → [JournalAgentContainer] → Plan: Pro, LLM: Gemini, Outputs: todos, summary, destination  
 * [Override Panel] → [AgentSupervisor] → Plan: Admin, LLM: GPT-4o, Actions: fallback, logs, audits
 */

import { 
  executeFileOrganizerContainer,
  executeJournalAgentContainer, 
  executeAgentSupervisor,
  ContainerRegistry,
  PlanLLMMapping 
} from './agentContainers';
import { PlanName, getPricingTier } from '../pricingConfig';

// Enhanced logging for container flows
function logContainer(message: string, containerName?: string, sessionId?: string) {
  const timestamp = new Date().toISOString();
  const container = containerName ? `[${containerName}]` : '';
  const session = sessionId ? `[${sessionId}]` : '';
  console.log(`${timestamp} ${container} ${session} ${message}`);
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Process File Upload Flow
 * [Upload File] → [FileOrganizerContainer]
 */
async function processFileUploadFlow(planName: PlanName, sessionId: string) {
  logContainer('🗂️ Processing File Upload Flow', 'FileOrganizerContainer', sessionId);
  
  const mockFile = {
    id: `file-${sessionId}`,
    name: 'vacation_memories.jpg',
    mimeType: 'image/jpeg',
    sizeMb: 3.2,
    content: Buffer.from('mock-image-data'),
    uploadedAt: new Date().toISOString()
  };
  
  const planInfo = getPricingTier(planName);
  const llmModel = PlanLLMMapping.fileOrganizer[planName] || 'groq-llama3';
  
  logContainer(`Plan: ${planInfo.name} ($${planInfo.pricePerMonth}/month)`, 'FileOrganizerContainer', sessionId);
  logContainer(`LLM: ${llmModel}`, 'FileOrganizerContainer', sessionId);
  
  try {
    const result = await executeFileOrganizerContainer('file.uploaded', planName, mockFile);
    
    logContainer(`✅ Outputs:`, 'FileOrganizerContainer', sessionId);
    logContainer(`  - Tags: [${result.outputs.tags?.join(', ')}]`, 'FileOrganizerContainer', sessionId);
    logContainer(`  - Folder: ${result.outputs.folder}`, 'FileOrganizerContainer', sessionId);
    logContainer(`  - Confidence: ${result.outputs.confidence}`, 'FileOrganizerContainer', sessionId);
    logContainer(`Processing Time: ${result.processingTime}ms`, 'FileOrganizerContainer', sessionId);
    
    return result;
  } catch (error: any) {
    logContainer(`❌ Error: ${error.message}`, 'FileOrganizerContainer', sessionId);
    throw error;
  }
}

/**
 * Process Journal Entry Flow  
 * [Journal Entry] → [JournalAgentContainer]
 */
async function processJournalEntryFlow(planName: PlanName, sessionId: string) {
  logContainer('📝 Processing Journal Entry Flow', 'JournalAgentContainer', sessionId);
  
  // Check if plan supports journaling
  if (planName === 'standard') {
    logContainer('⏭️ Journal features not available on Standard plan - skipping', 'JournalAgentContainer', sessionId);
    return null;
  }
  
  const mockJournal = {
    id: `journal-${sessionId}`,
    content: `Today I organized all my vacation photos from last summer. Need to remember to share them with family. 
    Should also create a photo album for the best memories. The AI suggestions were really helpful for organizing everything by date and location.`,
    createdAt: new Date().toISOString(),
    voiceRecording: false
  };
  
  const planInfo = getPricingTier(planName);
  const llmModel = PlanLLMMapping.journalAgent[planName] || 'gemini-1.5-pro';
  
  logContainer(`Plan: ${planInfo.name} ($${planInfo.pricePerMonth}/month)`, 'JournalAgentContainer', sessionId);
  logContainer(`LLM: ${llmModel}`, 'JournalAgentContainer', sessionId);
  
  try {
    const result = await executeJournalAgentContainer('journal.created', planName, mockJournal);
    
    logContainer(`✅ Outputs:`, 'JournalAgentContainer', sessionId);
    logContainer(`  - Todos: [${result.outputs.todos?.join(', ')}]`, 'JournalAgentContainer', sessionId);
    logContainer(`  - Summary: ${result.outputs.summary}`, 'JournalAgentContainer', sessionId);
    logContainer(`  - Destination: ${result.outputs.destination}`, 'JournalAgentContainer', sessionId);
    logContainer(`Processing Time: ${result.processingTime}ms`, 'JournalAgentContainer', sessionId);
    
    return result;
  } catch (error: any) {
    logContainer(`❌ Error: ${error.message}`, 'JournalAgentContainer', sessionId);
    throw error;
  }
}

/**
 * Process Admin Override Flow
 * [Override Panel] → [AgentSupervisor]  
 */
async function processAdminOverrideFlow(planName: PlanName, sessionId: string) {
  logContainer('⚙️ Processing Admin Override Flow', 'AgentSupervisor', sessionId);
  
  // Check if plan supports admin features
  if (!['admin', 'enterprise'].includes(planName)) {
    logContainer('⏭️ Admin features not available on current plan - skipping', 'AgentSupervisor', sessionId);
    return null;
  }
  
  const mockAdminData = {
    id: `admin-${sessionId}`,
    action: 'manual_intervention',
    reason: 'File processing failed, requiring manual review',
    affectedAgent: 'FileOrganizerContainer',
    userPlan: planName,
    requestedAt: new Date().toISOString()
  };
  
  const planInfo = getPricingTier(planName);
  const llmModel = 'gpt-4o'; // Always GPT-4o for supervisor
  
  logContainer(`Plan: ${planInfo.name} ($${planInfo.pricePerMonth}/month)`, 'AgentSupervisor', sessionId);
  logContainer(`LLM: ${llmModel}`, 'AgentSupervisor', sessionId);
  
  try {
    const result = await executeAgentSupervisor('admin.override_panel', planName, mockAdminData);
    
    logContainer(`✅ Actions:`, 'AgentSupervisor', sessionId);
    logContainer(`  - Fallback Handling: ${result.outputs.fallback_result}`, 'AgentSupervisor', sessionId);
    logContainer(`  - Logs: Audit entry created`, 'AgentSupervisor', sessionId);
    logContainer(`  - Audits: ${result.outputs.system_status}`, 'AgentSupervisor', sessionId);
    logContainer(`Processing Time: ${result.processingTime}ms`, 'AgentSupervisor', sessionId);
    
    return result;
  } catch (error: any) {
    logContainer(`❌ Error: ${error.message}`, 'AgentSupervisor', sessionId);
    throw error;
  }
}

/**
 * Demonstrate specific container flows
 */
async function demonstrateContainerFlows(planName: PlanName) {
  const sessionId = generateSessionId();
  
  logContainer(`🚀 Starting Container Flow Demonstration`, 'Orchestrator', sessionId);
  logContainer(`Target Plan: ${planName}`, 'Orchestrator', sessionId);
  logContainer('=' .repeat(80), 'Orchestrator', sessionId);
  
  const results = [];
  
  try {
    // 1. File Upload Flow (available on all plans)
    logContainer(`\n🔄 Flow 1: [Upload File] → [FileOrganizerContainer]`, 'Orchestrator', sessionId);
    const fileResult = await processFileUploadFlow(planName, sessionId);
    results.push(fileResult);
    
    // 2. Journal Entry Flow (Pro+ plans)
    logContainer(`\n🔄 Flow 2: [Journal Entry] → [JournalAgentContainer]`, 'Orchestrator', sessionId);
    const journalResult = await processJournalEntryFlow(planName, sessionId);
    if (journalResult) results.push(journalResult);
    
    // 3. Admin Override Flow (Admin/Enterprise plans)
    logContainer(`\n🔄 Flow 3: [Override Panel] → [AgentSupervisor]`, 'Orchestrator', sessionId);
    const adminResult = await processAdminOverrideFlow(planName, sessionId);
    if (adminResult) results.push(adminResult);
    
    // Summary
    logContainer('\n' + '=' .repeat(80), 'Orchestrator', sessionId);
    logContainer('📊 Container Flow Summary:', 'Orchestrator', sessionId);
    logContainer(`Total Containers Executed: ${results.length}`, 'Orchestrator', sessionId);
    logContainer(`Successful Executions: ${results.filter(r => r.success).length}`, 'Orchestrator', sessionId);
    
    results.forEach((result, index) => {
      logContainer(`  ${index + 1}. ${result.agentName}: ${result.success ? '✅' : '❌'} (${result.processingTime}ms)`, 'Orchestrator', sessionId);
    });
    
    return results;
    
  } catch (error: any) {
    logContainer(`💥 Container flow error: ${error.message}`, 'Orchestrator', sessionId);
    throw error;
  }
}

/**
 * Specific container demonstrations by trigger
 */
async function demonstrateSpecificFlow(flowType: string, planName: PlanName = 'pro') {
  const sessionId = generateSessionId();
  
  switch (flowType) {
    case 'file-upload':
      logContainer('🗂️ Demonstrating: [Upload File] → [FileOrganizerContainer]', 'Demo', sessionId);
      return await processFileUploadFlow(planName, sessionId);
      
    case 'journal-entry':
      logContainer('📝 Demonstrating: [Journal Entry] → [JournalAgentContainer]', 'Demo', sessionId);
      return await processJournalEntryFlow(planName, sessionId);
      
    case 'admin-override':
      logContainer('⚙️ Demonstrating: [Override Panel] → [AgentSupervisor]', 'Demo', sessionId);
      return await processAdminOverrideFlow('enterprise', sessionId); // Force enterprise for admin demo
      
    default:
      throw new Error(`Unknown flow type: ${flowType}`);
  }
}

/**
 * Main orchestrator entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'demo-all';
  const planArg = args.find((a) => a.startsWith('--plan='));
  const plan: PlanName = (planArg ? planArg.split('=')[1] : 'pro') as PlanName;
  
  console.log('🎯 FileInASnap Container Flow Orchestrator');
  console.log('==========================================');
  
  try {
    switch (command) {
      case 'file-upload':
        await demonstrateSpecificFlow('file-upload', plan);
        break;
        
      case 'journal-entry':
        await demonstrateSpecificFlow('journal-entry', plan);
        break;
        
      case 'admin-override':
        await demonstrateSpecificFlow('admin-override', plan);
        break;
        
      case 'demo-all':
      default:
        // Demonstrate all flows with different plans
        console.log('\n🔄 Testing Standard Plan (File Upload Only):');
        await demonstrateContainerFlows('standard');
        
        console.log('\n🔄 Testing Pro Plan (File + Journal):');
        await demonstrateContainerFlows('pro');
        
        console.log('\n🔄 Testing Enterprise Plan (All Flows):');
        await demonstrateContainerFlows('enterprise');
        break;
    }
    
    console.log('\n✅ Container flow demonstration completed successfully!');
    
  } catch (error: any) {
    console.error('\n💥 Container flow demonstration failed:', error.message);
    process.exit(1);
  }
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

// Run the orchestrator
main().catch((err) => {
  console.error('💥 Fatal orchestrator error:', err);
  process.exit(1);
});