# 🚀 FileInASnap - AI-Powered File Intelligence Platform

**Transform your digital chaos into organized memories with AI agents that work for you.**

FileInASnap is a modular, agent-based AI application that automatically organizes your files, captures memories, maps relationships, and creates meaningful stories from your digital life. Built on the BMAD (Build, Measure, Analyze, Deploy) methodology with containerized AI agents.

## 🎯 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd fileinasnap

# Install dependencies
npm install

# Start the orchestrator
./start.sh

# Or run with specific plan (including new Creator plan)
./start.sh veteran build-all
./start.sh creator build-all
```

## 🏗️ Architecture Overview

FileInASnap uses a **modular agent architecture** where specialized AI agents handle different aspects of file organization and memory management:

- **🗂️ File Organizer Agent**: Smart renaming, tagging, and folder routing
- **📝 Journal Agent**: Memory capture and document analysis  
- **👥 Relationship Agent**: Face recognition and relationship mapping
- **📖 Story Agent**: AI-generated narratives from your memories
- **📊 Analytics Agent**: Usage insights and performance metrics

### BMAD Orchestrator

The `bmadOrchestrator.ts` coordinates all agents using the Build-Measure-Analyze-Deploy methodology:

```bash
# Run all agents
npm run start

# Run specific agents
npm run agent:file        # File intelligence only
npm run agent:journal     # Journaling and parsing
npm run agent:relationship # Face recognition
npm run agent:story       # Story generation
npm run agent:analytics   # View analytics
```

## 💰 Subscription Tiers

FileInASnap offers 5 carefully designed tiers to match your needs:

### 🌟 Standard - $9/month
*GROQ-powered intelligence for individuals*
- ✅ File upload + Smart Folder routing
- ✅ Auto-tagging + scoring  
- ✅ GROQ-powered AI agents
- ✅ Limited journaling (read-only)
- ✅ 5GB storage, 200 uploads/month
- 🤖 **AI Model**: GROQ Llama3

### 🚀 Pro - $19/month (Most Popular)
*Gemini-enhanced for memory capture*
- ✅ **All Standard features**
- ✅ Full Journaling + Memory Timeline
- ✅ Gemini 1.5 agents
- ✅ Smart Folder creation + override
- ✅ People tracing + memory filters
- ✅ 25GB storage, 1000 uploads/month
- 🤖 **AI Model**: Gemini 1.5 Pro

### 🎨 Creator Plan - $14.99/month
*Content optimization for creators*
- ✅ Unlimited journaling + tagging
- ✅ Gemini/GPT-4 content agent access
- ✅ Video + audio upload support
- ✅ Auto-captioning and summarization
- ✅ Streamlined memory storytelling tools
- ✅ 50GB storage, unlimited uploads
- 🤖 **AI Model**: GPT-4

### ⚡ Veteran - $49/month  
*Claude-powered agent chains*
- ✅ **All Pro features**
- ✅ Claude 3 agent chains
- ✅ Voice assistant journaling
- ✅ Admin override + agent feedback
- ✅ API export + collaboration folders
- ✅ 100GB storage, 5000 uploads/month
- 🤖 **AI Model**: Claude 3 Sonnet

### 🏢 Enterprise - $149/month
*Full control with audit trails*
- ✅ **All Veteran features**
- ✅ Dedicated admin dashboards
- ✅ Audit trail + fallback analytics
- ✅ Bulk org user onboarding
- ✅ Custom SLAs and support
- ✅ Unlimited storage and uploads
- 🤖 **AI Model**: Claude 3 Opus

## 🔧 Agent System Details

### File Organizer Agent
```typescript
await fileOrganizerAgent(planName, file, currentStorage, currentUploads);
```
- **Input**: File upload, plan context, usage quotas
- **Output**: Smart filename, tags, summary, confidence scores
- **AI Models**: Plan-specific (GPT-3.5 → Claude Opus)

### Journal Agent  
```typescript
await journalAgent(planName, journalEntry);
```
- **Input**: Text entries, voice recordings, documents
- **Output**: Emotional analysis, extracted references, destination suggestions
- **Available**: Pro tier and above

### Relationship Agent
```typescript
await relationshipAgent(planName, imageBuffer);
```
- **Input**: Photos and videos
- **Output**: Face detection, relationship clustering, social graphs  
- **Available**: Veteran tier and above

### Story Agent
```typescript
await storyAgent(planName, storyRequest);
```
- **Input**: Selected memories, people, time periods
- **Output**: AI-generated narratives and memory highlights
- **Available**: Veteran tier and above

## 🔀 Integration Points

### Supabase Integration
- **Storage**: All files stored in Supabase buckets with encryption
- **Database**: User data, file metadata, and relationships
- **Auth**: User authentication and plan management
- **Real-time**: Live updates for file processing status

### Make.com Workflows
- **Triggers**: File uploads, journal entries, workflow events
- **Actions**: Agent orchestration, notification delivery, data exports
- **Automation**: Custom workflows based on user preferences

## 🎛️ Configuration Management

### Pricing Configuration
FileInASnap uses a modular pricing system for easy A/B testing:

```typescript
// Update pricing in pricingConfig.ts
export const PRICING_EXPERIMENTS = [
  {
    id: 'creator-focused',
    name: 'Creator-Focused Pricing',
    active: true, // Toggle experiments
    tiers: [...] // Modified pricing
  }
];
```

### Feature Gating
```typescript
import { hasFeature } from './pricingConfig';

if (hasFeature(userPlan, 'relationshipMapping')) {
  await relationshipAgent(userPlan, imageData);
}
```

## 🚀 Development

### Project Structure
```
fileinasnap/
├── mobile_classification_app/     # Core agent system
│   ├── agents/                    # Individual AI agents
│   ├── bmadOrchestrator.ts       # Main orchestrator
│   └── containers/               # Agent containers
├── backend/                      # FastAPI server
├── frontend/                     # React UI
├── docs/                         # Documentation  
├── pricingConfig.ts             # Pricing management
└── start.sh                     # Startup script
```

### Available Scripts
```bash
npm run start          # Full orchestration
npm run dev           # Development mode with hot reload
npm run build         # TypeScript compilation
npm run test          # Run test suite
npm run lint          # Code linting
npm run format        # Code formatting

# BMAD Agent Commands (Original System)
npm run agent:file         # File intelligence
npm run agent:journal      # Journal processing  
npm run agent:relationship # Relationship mapping
npm run agent:story        # Story generation
npm run agent:analytics    # Analytics dashboard

# Container Flow Commands (New Architecture)
npm run container:flows    # Test all container flows
npm run container:file     # FileOrganizerContainer only
npm run container:journal  # JournalAgentContainer only
npm run container:admin    # AgentSupervisor only
```

### Environment Variables
```bash
# Required for AI models
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_claude_key  
GOOGLE_API_KEY=your_gemini_key

# Database and storage
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
MONGO_URL=your_mongodb_url

# Make.com integration
MAKE_WEBHOOK_URL=your_make_webhook
MAKE_API_KEY=your_make_api_key
```

## 📚 Documentation

- [Architecture Guide](./docs/architecture.md) - BMAD methodology and agent containers
- [UI Guide](./docs/ui-guide.md) - Lovable components and user interface
- [API Reference](./docs/api.md) - Backend API documentation
- [Deployment Guide](./docs/deployment.md) - Production deployment

## 🔍 Monitoring & Analytics

### Built-in Analytics (Enterprise)
- Agent performance metrics
- User engagement tracking  
- Feature usage analytics
- Cost optimization insights

### Health Checks
```bash
# Check agent status
curl http://localhost:8001/api/health

# View orchestrator logs
tail -f logs/orchestrator.log

# Monitor agent performance
npm run agent:analytics
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain agent isolation and modularity
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Community**: [GitHub Discussions](https://github.com/fileinasnap/discussions)
- **Documentation**: [docs.fileinasnap.com](https://docs.fileinasnap.com)
- **Enterprise Support**: enterprise@fileinasnap.com
- **Status Page**: [status.fileinasnap.com](https://status.fileinasnap.com)

---

**Built with ❤️ by the FileInASnap team**

*Transform your digital chaos into organized memories with AI that works for you.*