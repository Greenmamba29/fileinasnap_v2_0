# 📚 FileInASnap Setup Instructions

Welcome to FileInASnap! This guide will help you set up and deploy your modular AI-powered file organization platform.

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (for TypeScript agents and orchestrator)
- **Python 3.11+** (for FastAPI backend)
- **MongoDB** (for data storage)
- **AI API Keys** (OpenAI, Anthropic, Google, GROQ)

### Installation

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd fileinasnap
   npm install
   ```

2. **Install Python Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   yarn install
   cd ..
   ```

### Environment Configuration

Create environment files for each component:

#### Backend Environment (`.env`)
```bash
# Database
MONGO_URL=mongodb://localhost:27017/fileinasnap

# AI API Keys
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GOOGLE_API_KEY=your-google-ai-key
GROQ_API_KEY=gsk_your-groq-key

# External Integrations
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
MAKE_WEBHOOK_URL=https://hook.us1.make.com/your-webhook
MAKE_API_KEY=your-make-api-key

# Security
JWT_SECRET=your-jwt-secret-key
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

#### Frontend Environment (`.env`)
```bash
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### First Run

1. **Start All Services**
   ```bash
   # Start with supervisor (recommended)
   sudo supervisorctl restart all
   
   # Or run individually for development
   npm run dev          # BMAD orchestrator in watch mode
   cd backend && uvicorn server:app --reload --port 8001
   cd frontend && yarn start
   ```

2. **Test the System**
   ```bash
   # Test container flows
   npm run container:flows
   
   # Test specific containers
   npm run container:file -- --plan=standard
   npm run container:journal -- --plan=pro
   npm run container:admin -- --plan=enterprise
   ```

3. **Access the Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8001/api
   - **API Documentation**: http://localhost:8001/docs

## 🏗️ Architecture Overview

FileInASnap uses a modular container architecture:

### Directory Structure
```
fileinasnap/
├── bmad-containers/          # AI agent containers
│   ├── file-intelligence/    # File organization & routing
│   ├── journaling/           # Memory capture & analysis
│   ├── relationships/        # Face recognition & mapping
│   ├── storytelling/         # AI narrative generation
│   ├── admin-supervisor/     # System oversight
│   └── registry/             # Container registry & routing
├── orchestrator/             # BMAD CLI tools & AgentSupervisor
├── ui-components/            # Lovable connected components
├── backend/                  # FastAPI server
├── frontend/                 # React application
└── docs/                     # Documentation
```

### Container Flow Architecture
```
[Upload File] → [FileIntelligenceContainer]
  └── Plan: Standard+ (all plans)
  └── LLM: GROQ → Gemini → GPT-4 → Claude
  └── Outputs: tags, folder, confidence

[Journal Entry] → [JournalingContainer]
  └── Plan: Pro+ (not on Standard)
  └── LLM: Gemini → GPT-4 → Claude
  └── Outputs: todos, summary, destination

[Override Panel] → [AdminSupervisorContainer]
  └── Plan: Admin/Enterprise only
  └── LLM: Always GPT-4o
  └── Actions: fallback, logs, audits
```

## 🔧 Container Management

### Using the BMAD CLI

The BMAD CLI provides comprehensive container management:

```bash
# Run full pipeline for a plan
bmad-cli pipeline pro

# Execute specific containers
bmad-cli container FileIntelligenceContainer standard
bmad-cli container JournalingContainer pro
bmad-cli container AdminSupervisorContainer enterprise

# Trigger containers by event
bmad-cli trigger file.uploaded veteran
bmad-cli trigger journal.created pro
bmad-cli trigger admin.override_panel enterprise

# List available features
bmad-cli list containers pro
bmad-cli list features enterprise
```

### Container Development

#### Creating a New Container

1. **Create Container Directory**
   ```bash
   mkdir bmad-containers/your-feature
   ```

2. **Implement Container Class**
   ```typescript
   // bmad-containers/your-feature/container.ts
   import { ContainerBase, ContainerConfig, ContainerOutput } from '../registry/types';
   
   export class YourFeatureContainer extends ContainerBase {
     static readonly config: ContainerConfig = {
       name: 'YourFeatureContainer',
       featureModule: 'your-feature',
       triggers: ['your.trigger'],
       minimumPlan: 'pro',
       outputSchema: ['output1', 'output2'],
       description: 'Your feature description'
     };
     
     async execute(planName: PlanName, input: any, sessionId: string): Promise<ContainerOutput> {
       // Your container logic here
     }
   }
   ```

3. **Register Container**
   ```typescript
   // bmad-containers/registry/index.ts
   import { YourFeatureContainer } from '../your-feature/container';
   
   export const CONTAINER_REGISTRY = {
     // ... existing containers
     'YourFeatureContainer': YourFeatureContainer
   };
   ```

## 🎨 UI Component Development

### Lovable Component Integration

FileInASnap provides plan-aware UI components:

```tsx
import { SmartUploadZone, MemoryTimeline, AdminDashboard } from './ui-components';

// Plan-aware upload component
<SmartUploadZone
  planName={user.plan}
  onUpload={handleFileUpload}
  onProcessingComplete={handleResult}
/>

// Memory timeline (Pro+ feature)
<MemoryTimeline
  planName={user.plan}
  memories={userMemories}
  onStoryGenerate={generateStory}
/>

// Admin dashboard (Enterprise only)
<AdminDashboard
  planName={user.plan}
  onContainerOverride={handleOverride}
  onSystemAudit={runAudit}
/>
```

### Component Development Guidelines

1. **Plan Awareness**: Always check feature availability
2. **Graceful Degradation**: Show upgrade prompts for unavailable features
3. **Real-time Updates**: Use WebSocket connections for live updates
4. **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔒 Security & Production Setup

### API Key Management

1. **Development**: Use `.env` files (never commit to git)
2. **Production**: Use environment variables or secret managers

```bash
# AWS Secrets Manager
aws secretsmanager create-secret \
  --name "fileinasnap/api-keys" \
  --secret-string '{
    "OPENAI_API_KEY": "sk-...",
    "ANTHROPIC_API_KEY": "sk-ant-..."
  }'
```

### Database Setup

#### MongoDB Configuration
```javascript
// MongoDB indexes for performance
db.files.createIndex({ "user_id": 1, "created_at": -1 })
db.journal_entries.createIndex({ "user_id": 1, "created_at": -1 })
db.container_executions.createIndex({ "plan_name": 1, "created_at": -1 })
```

#### Supabase Schema
```sql
-- Files table with plan-aware metadata
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  plan_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  ai_generated_name TEXT,
  tags TEXT[],
  ai_model TEXT,
  container_name TEXT,
  processing_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Policy for user access
CREATE POLICY "Users can manage their own files"
  ON files FOR ALL
  USING (auth.uid() = user_id);
```

### Container Security

1. **Input Validation**: Validate all container inputs
2. **Resource Limits**: Set memory and CPU limits
3. **Plan Validation**: Always verify plan access
4. **Audit Logging**: Log all administrative actions

## 🚀 Deployment Options

### Docker Deployment

```yaml
# docker-compose.yml
version: '3.8'
services:
  orchestrator:
    build: 
      context: .
      dockerfile: Dockerfile.orchestrator
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./bmad-containers:/app/bmad-containers
      
  backend:
    build: ./backend
    environment:
      - MONGO_URL=${MONGO_URL}
    ports:
      - "8001:8001"
      
  frontend:
    build: ./frontend
    environment:
      - REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
    ports:
      - "3000:3000"
```

### Kubernetes Deployment

```yaml
# k8s/orchestrator-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fileinasnap-orchestrator
spec:
  replicas: 2
  selector:
    matchLabels:
      app: orchestrator
  template:
    spec:
      containers:
      - name: orchestrator
        image: fileinasnap/orchestrator:latest
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-keys
              key: openai
        resources:
          limits:
            memory: "1Gi"
            cpu: "500m"
```

### Cloud Deployment

#### AWS ECS
- Use Fargate for serverless container deployment
- Store secrets in AWS Secrets Manager
- Use Application Load Balancer for traffic routing

#### Google Cloud Run
- Deploy containers with automatic scaling
- Integrate with Google AI APIs
- Use Cloud Storage for file uploads

#### Azure Container Apps
- Deploy with managed container service
- Use Azure Key Vault for secrets
- Integrate with Azure Cognitive Services

## 🔍 Monitoring & Troubleshooting

### Health Checks

```bash
# Check container health
curl http://localhost:8001/api/health

# Monitor orchestrator
npm run container:flows -- --plan=enterprise

# Check individual containers
bmad-cli list containers enterprise
```

### Log Monitoring

```bash
# Container logs
docker logs fileinasnap-orchestrator

# Supervisor logs (if using supervisor)
tail -f /var/log/supervisor/orchestrator.*.log

# Application logs
tail -f logs/bmad-orchestrator.log
```

### Common Issues

1. **Container Fails to Start**
   - Check API keys in environment
   - Verify plan permissions
   - Review container logs

2. **Plan Features Not Working**
   - Verify pricing configuration
   - Check feature gating logic
   - Test with correct plan tier

3. **Performance Issues**
   - Monitor AI API quotas
   - Check database indexes
   - Review container resource limits

## 📞 Support & Resources

- **Documentation**: [Full Architecture Guide](./architecture.md)
- **API Reference**: [API Documentation](./api.md)
- **UI Guide**: [Component Documentation](./ui-guide.md)
- **Feature Maps**: [Feature Matrix](./feature-maps.md)

For additional support:
- Check GitHub Issues
- Review error logs with session IDs
- Test with BMAD CLI tools
- Verify plan configurations

---

**🎉 You're ready to deploy FileInASnap!**

The modular container architecture ensures scalability from individual users to enterprise deployments. Each container can be scaled independently based on demand and subscription tiers.