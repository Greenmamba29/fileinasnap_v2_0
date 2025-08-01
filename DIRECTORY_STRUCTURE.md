# 📁 FileInASnap Project Directory Structure

This document provides a comprehensive overview of the FileInASnap project structure, explaining the purpose and contents of each directory and file.

## 🗂️ Root Directory Overview

```
fileinasnap/
├── 📁 backend/                    # FastAPI backend server
├── 📁 frontend/                   # React frontend application  
├── 📁 mobile_classification_app/  # Core AI agent system
├── 📁 docs/                       # Comprehensive documentation
├── 📁 tests/                      # Test suites and utilities
├── 📁 scripts/                    # Utility and deployment scripts
├── 📄 package.json                # Node.js project configuration
├── 📄 pricingConfig.ts            # Modular pricing & A/B testing config
├── 📄 README.md                   # Main project documentation
├── 📄 start.sh                    # Orchestrator startup script
├── 📄 .replit                     # Replit deployment configuration
└── 📄 DIRECTORY_STRUCTURE.md      # This file
```

## 🔧 Backend Directory (`/backend/`)

**Purpose**: FastAPI-based REST API server providing authentication, file management, and database operations.

```
backend/
├── 📄 server.py              # Main FastAPI application with API routes
├── 📄 requirements.txt       # Python dependencies
├── 📄 .env                   # Backend environment variables
├── 📁 __pycache__/          # Python bytecode cache (auto-generated)
└── 📁 models/               # Database models and schemas (future)
    ├── 📄 user.py
    ├── 📄 file.py
    └── 📄 subscription.py
```

**Key Files**:
- `server.py`: Core API endpoints with `/api` prefix for Kubernetes ingress compatibility
- `requirements.txt`: All Python dependencies including FastAPI, MongoDB driver, AI SDK integrations
- `.env`: Contains `MONGO_URL` and other backend-specific environment variables

## ⚛️ Frontend Directory (`/frontend/`)

**Purpose**: React-based user interface with Tailwind CSS styling and plan-aware components.

```
frontend/
├── 📁 public/                # Static assets
│   ├── 📄 index.html
│   ├── 📄 favicon.ico
│   └── 📄 manifest.json
├── 📁 src/                   # React source code
│   ├── 📄 index.js          # Application entry point
│   ├── 📄 App.js            # Main React component
│   ├── 📄 App.css           # Component-specific styles
│   ├── 📄 index.css         # Global Tailwind styles
│   ├── 📁 components/       # Reusable UI components
│   │   ├── 📄 UploadZone.js
│   │   ├── 📄 MemoryTimeline.js
│   │   ├── 📄 RelationshipGraph.js
│   │   └── 📄 StoryGenerator.js
│   ├── 📁 pages/           # Route-based page components
│   │   ├── 📄 Dashboard.js
│   │   ├── 📄 Upload.js
│   │   ├── 📄 Journal.js
│   │   └── 📄 Analytics.js
│   ├── 📁 hooks/           # Custom React hooks
│   │   ├── 📄 usePlan.js
│   │   ├── 📄 useFileUpload.js
│   │   └── 📄 useAnalytics.js
│   ├── 📁 services/        # API integration layer
│   │   ├── 📄 api.js
│   │   ├── 📄 auth.js
│   │   └── 📄 subscription.js
│   └── 📁 utils/           # Utility functions
│       ├── 📄 planHelpers.js
│       ├── 📄 formatters.js
│       └── 📄 constants.js
├── 📄 package.json          # Frontend dependencies and scripts
├── 📄 yarn.lock            # Dependency lock file
├── 📄 .env                 # Frontend environment variables (REACT_APP_BACKEND_URL)
├── 📄 tailwind.config.js   # Tailwind CSS configuration
├── 📄 postcss.config.js    # PostCSS configuration
├── 📄 craco.config.js      # Create React App configuration override
└── 📄 README.md           # Frontend-specific documentation
```

**Key Features**:
- Plan-aware components that show/hide features based on subscription tier
- Responsive design with mobile-first approach
- Integration with backend API using environment variables
- Tailwind CSS for utility-first styling

## 🤖 Mobile Classification App (`/mobile_classification_app/`)

**Purpose**: Core AI agent system implementing the BMAD (Build-Measure-Analyze-Deploy) methodology.

```
mobile_classification_app/
├── 📄 bmadOrchestrator.ts    # Main orchestrator coordinating all agents
├── 📁 agents/                # Individual AI agent implementations
│   ├── 📄 plans.ts          # Legacy plan definitions (backward compatibility)
│   ├── 📄 planManager.ts    # Enhanced plan management with pricing integration
│   ├── 📄 fileOrganizerAgent.ts    # File intelligence and organization
│   ├── 📄 journalAgent.ts          # Journal analysis and emotion detection
│   ├── 📄 relationshipAgent.ts     # Face recognition and relationship mapping
│   ├── 📄 storyAgent.ts            # AI narrative and story generation
│   └── 📄 analyticsAgent.ts        # Performance metrics and insights
├── 📁 containers/           # Agent containerization configs (future)
│   ├── 📄 fileAgent.dockerfile
│   ├── 📄 journalAgent.dockerfile
│   └── 📄 orchestrator.dockerfile
├── 📁 utils/               # Shared utilities and helpers
│   ├── 📄 logger.ts
│   ├── 📄 metrics.ts
│   └── 📄 aiModelClient.ts
└── 📁 types/               # TypeScript type definitions
    ├── 📄 agent.types.ts
    ├── 📄 plan.types.ts
    └── 📄 orchestrator.types.ts
```

**Agent Responsibilities**:
- **fileOrganizerAgent**: Smart file renaming, tagging, folder routing with plan-appropriate AI models
- **journalAgent**: Text analysis, emotion detection, memory extraction (Pro+ plans)
- **relationshipAgent**: Face recognition, relationship mapping (Veteran+ plans)
- **storyAgent**: AI narrative generation from memories (Veteran+ plans)
- **analyticsAgent**: Performance monitoring and insights (Enterprise plan)

## 📚 Documentation (`/docs/`)

**Purpose**: Comprehensive project documentation covering architecture, API, UI guidelines, and deployment.

```
docs/
├── 📄 architecture.md       # BMAD methodology & agent container registry
├── 📄 ui-guide.md          # Lovable components & design system
├── 📄 api.md               # REST API reference and examples
├── 📄 deployment.md        # Production deployment guide
├── 📁 assets/              # Documentation images and diagrams
│   ├── 📄 architecture-diagram.png
│   ├── 📄 ui-components.png
│   └── 📄 pricing-tiers.png
├── 📁 examples/            # Code examples and tutorials
│   ├── 📄 api-integration.js
│   ├── 📄 webhook-setup.py
│   └── 📄 agent-custom.ts
└── 📁 specs/               # Technical specifications
    ├── 📄 agent-protocol.md
    ├── 📄 pricing-config.md
    └── 📄 integration-spec.md
```

## 🧪 Tests Directory (`/tests/`)

**Purpose**: Test suites for all components including unit tests, integration tests, and end-to-end testing.

```
tests/
├── 📁 unit/                # Unit tests for individual components
│   ├── 📁 agents/
│   │   ├── 📄 fileOrganizer.test.ts
│   │   ├── 📄 journalAgent.test.ts
│   │   └── 📄 planManager.test.ts
│   ├── 📁 backend/
│   │   ├── 📄 api.test.py
│   │   └── 📄 models.test.py
│   └── 📁 frontend/
│       ├── 📄 components.test.js
│       └── 📄 hooks.test.js
├── 📁 integration/         # Integration tests across components
│   ├── 📄 orchestrator.test.ts
│   ├── 📄 api-frontend.test.js
│   └── 📄 pricing-flow.test.ts
├── 📁 e2e/                # End-to-end user journey tests
│   ├── 📄 upload-workflow.test.js
│   ├── 📄 subscription-upgrade.test.js
│   └── 📄 analytics-dashboard.test.js
├── 📁 fixtures/           # Test data and mock files
│   ├── 📄 sample-files/
│   ├── 📄 mock-responses.json
│   └── 📄 test-users.json
├── 📁 utils/              # Testing utilities and helpers
│   ├── 📄 testHelpers.js
│   ├── 📄 mockAgents.ts
│   └── 📄 setupTests.js
└── 📄 __init__.py         # Python test package initialization
```

## 🛠️ Scripts Directory (`/scripts/`)

**Purpose**: Utility scripts for development, deployment, and maintenance tasks.

```
scripts/
├── 📄 setup.sh            # Development environment setup
├── 📄 deploy.sh           # Production deployment script
├── 📄 migrate.py          # Database migration utility
├── 📄 seed-data.py        # Sample data generation
├── 📄 backup.sh           # Database backup script
├── 📄 pricing-test.ts     # A/B testing for pricing configurations
├── 📄 agent-health.ts     # Agent health monitoring
└── 📁 docker/             # Docker-related scripts
    ├── 📄 build-all.sh
    ├── 📄 push-images.sh
    └── 📄 docker-compose.dev.yml
```

## 📄 Root Configuration Files

### `package.json`
Main Node.js project configuration with scripts for running agents:
```json
{
  "name": "fileinasnap",
  "scripts": {
    "start": "tsx mobile_classification_app/bmadOrchestrator.ts build-all",
    "agent:file": "tsx mobile_classification_app/bmadOrchestrator.ts build-file-intelligence",
    "agent:journal": "tsx mobile_classification_app/bmadOrchestrator.ts build-journaling"
  }
}
```

### `pricingConfig.ts`
Centralized pricing configuration supporting A/B testing:
```typescript
export const PRICING_EXPERIMENTS: PricingExperiment[] = [
  {
    id: 'default',
    name: 'Default Pricing',
    active: true,
    tiers: DEFAULT_PRICING,
  }
];
```

### `start.sh`
Executable script for launching the BMAD orchestrator with comprehensive error handling and environment validation.

### `.replit`
Configuration for Replit deployment with proper Node.js environment setup and port configuration.

## 🔄 Data Flow Between Directories

### Upload Workflow
```
Frontend (/frontend/src/components/UploadZone.js)
    ↓ HTTP POST with file
Backend (/backend/server.py /api/files/upload)
    ↓ Triggers webhook
Orchestrator (/mobile_classification_app/bmadOrchestrator.ts)
    ↓ Executes agents based on plan
Agents (/mobile_classification_app/agents/*.ts)
    ↓ Return processed metadata
Backend (stores results in MongoDB)
    ↓ Real-time updates
Frontend (displays results to user)
```

### Plan Management Flow
```
PricingConfig (/pricingConfig.ts)
    ↓ Imported by
Plan Manager (/mobile_classification_app/agents/planManager.ts)
    ↓ Used by
All Agents (feature gating and AI model selection)
    ↓ Enforced in
Frontend Components (show/hide features)
    ↓ Validated by
Backend API (quota enforcement)
```

## 🚀 Getting Started with the Structure

1. **Start with Documentation** (`/docs/`): Read architecture.md and api.md
2. **Examine Pricing Configuration** (`/pricingConfig.ts`): Understand subscription tiers
3. **Explore Agent System** (`/mobile_classification_app/`): See how AI agents work
4. **Review API Integration** (`/backend/server.py`): Understand API endpoints
5. **Study UI Components** (`/frontend/src/`): Learn the user interface
6. **Run Tests** (`/tests/`): Validate your understanding

## 📈 Future Structure Enhancements

### Planned Additions
```
fileinasnap/
├── 📁 migrations/          # Database migration scripts
├── 📁 monitoring/          # Prometheus, Grafana configs
├── 📁 kubernetes/          # K8s deployment manifests
├── 📁 terraform/           # Infrastructure as Code
├── 📁 webhooks/           # Make.com webhook handlers
├── 📁 sdk/                # Client SDKs for integration
└── 📁 examples/           # Integration examples
```

This directory structure ensures FileInASnap maintains clean separation of concerns while enabling efficient development, testing, and deployment workflows.