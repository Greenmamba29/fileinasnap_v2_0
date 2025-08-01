# 🗺️ FileInASnap Feature Maps

## Feature Module Mapping

This document provides a comprehensive mapping of features to containers, plans, and capabilities across the FileInASnap platform.

## 📊 Plan Feature Matrix

| Feature | Standard | Pro | Creator | Veteran | Enterprise |
|---------|----------|-----|---------|---------|------------|
| **File Intelligence** | ✅ GROQ | ✅ Gemini | ✅ GPT-4 | ✅ Claude Sonnet | ✅ Claude Opus |
| **Smart Folder Routing** | ✅ Basic | ✅ Enhanced | ✅ Content-aware | ✅ Semantic | ✅ Advanced |
| **Smart Folder Creation** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Journaling** | 📖 Read-only | ✅ Full | ✅ Content-focused | ✅ Voice + Chains | ✅ Audit + Enterprise |
| **Memory Timeline** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Voice Assistant** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Video Captioning** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Audio Support** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Relationship Mapping** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Face Recognition** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Story Generation** | ❌ | ❌ | ✅ Content | ✅ Narrative | ✅ Comprehensive |
| **People Tracing** | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Memory Filters** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Admin Override** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Agent Feedback** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Admin Dashboard** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Audit Trail** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Fallback Analytics** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **API Export** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Collaboration Folders** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Bulk User Onboarding** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Premium Support** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Custom SLAs** | ❌ | ❌ | ❌ | ❌ | ✅ |

## 🤖 Container to Feature Module Mapping

### File Intelligence Container
- **Module**: `file-intelligence`
- **Triggers**: `file.uploaded`, `file.drag_drop`, `file.api_upload`
- **Plans**: All plans (Standard+)
- **Features Mapped**:
  ```typescript
  {
    fileIntelligence: true,           // All plans
    smartFolderRouting: true,         // All plans  
    smartFolderCreation: 'pro+',      // Pro and above
  }
  ```
- **AI Model Progression**:
  - Standard: GROQ Llama3 → Basic file analysis
  - Pro: Gemini 1.5 Pro → Enhanced categorization
  - Creator: GPT-4 → Content optimization
  - Veteran: Claude 3 Sonnet → Semantic understanding
  - Enterprise: Claude 3 Opus → Maximum accuracy

### Journaling Container
- **Module**: `journaling`
- **Triggers**: `journal.created`, `journal.voice_recorded`, `journal.text_input`
- **Plans**: Pro+ (not available on Standard)
- **Features Mapped**:
  ```typescript
  {
    journaling: 'full',               // Pro+
    memoryTimeline: true,             // Pro+
    documentParsing: true,            // Pro+
    voiceAssistant: 'veteran+',       // Veteran and Enterprise
    audioCaptioning: 'creator+',      // Creator, Veteran, Enterprise
  }
  ```
- **Processing Levels**:
  - Pro: Emotion analysis, todo extraction
  - Creator: Content optimization, story suggestions
  - Veteran: Voice processing, agent chaining
  - Enterprise: Full audit trail, advanced insights

### Relationship Container
- **Module**: `relationships`
- **Triggers**: `image.face_detected`, `relationship.mapping_requested`, `photo.person_tagging`
- **Plans**: Veteran+ only
- **Features Mapped**:
  ```typescript
  {
    relationshipMapping: true,        // Veteran+
    faceRecognition: true,            // Veteran+
    peopleTracing: true,              // Veteran+
  }
  ```
- **Capabilities by Plan**:
  - Veteran: Face detection, basic relationship clustering
  - Enterprise: Advanced relationship mapping, audit logging

### Storytelling Container
- **Module**: `storytelling`
- **Triggers**: `story.generation_requested`, `memory.compilation`, `narrative.creation`
- **Plans**: Creator, Veteran, Enterprise
- **Features Mapped**:
  ```typescript
  {
    storyGeneration: true,            // Creator, Veteran, Enterprise
    memoryFilters: 'veteran+',        // Veteran and Enterprise
  }
  ```
- **Story Types by Plan**:
  - Creator: Content-focused narratives, social media optimization
  - Veteran: Advanced narrative chains, relationship stories
  - Enterprise: Comprehensive multi-chapter stories with analytics

### Admin Supervisor Container
- **Module**: `admin-supervisor`
- **Triggers**: `admin.override_panel`, `system.fallback_required`, `admin.manual_intervention`
- **Plans**: Enterprise only (Admin access)
- **Features Mapped**:
  ```typescript
  {
    adminOverride: true,              // Enterprise
    agentFeedback: true,              // Enterprise  
    adminDashboard: true,             // Enterprise
    auditTrail: true,                 // Enterprise
    fallbackAnalytics: true,          // Enterprise
  }
  ```

## 🎨 UI Component Feature Mapping

### SmartUploadZone Component
- **Available**: All plans
- **Plan-Aware Features**:
  ```typescript
  {
    basicUpload: 'standard+',         // All plans
    aiProcessingFeedback: 'standard+', // All plans
    smartFolderSuggestions: 'pro+',   // Pro and above
    voiceNotes: 'veteran+',           // Veteran and Enterprise
    videoCaptioning: 'creator+',      // Creator, Veteran, Enterprise
  }
  ```

### MemoryTimeline Component
- **Available**: Pro+ plans
- **Plan-Aware Features**:
  ```typescript
  {
    basicTimeline: 'pro+',            // Pro and above
    emotionalClustering: 'pro+',      // Pro and above
    peopleFiltering: 'veteran+',      // Veteran and above
    storyGeneration: 'creator+',      // Creator, Veteran, Enterprise
    voiceMemories: 'veteran+',        // Veteran and Enterprise
  }
  ```

### AdminDashboard Component
- **Available**: Enterprise only
- **Enterprise Features**:
  ```typescript
  {
    systemMonitoring: true,           // Enterprise
    containerOverrides: true,         // Enterprise
    auditLogs: true,                  // Enterprise
    performanceMetrics: true,         // Enterprise
    alertManagement: true,            // Enterprise
  }
  ```

## 📱 API Endpoint Feature Mapping

### File Intelligence Endpoints
```
POST /api/files/upload               # All plans
GET /api/files/{id}                  # All plans
PUT /api/files/{id}/organize         # Pro+ (manual override)
DELETE /api/files/{id}               # All plans
GET /api/files/analytics             # Enterprise only
```

### Journaling Endpoints
```
POST /api/journal/entries            # Pro+
GET /api/journal/timeline            # Pro+
POST /api/journal/voice              # Veteran+
GET /api/journal/insights            # Pro+
GET /api/journal/analytics           # Enterprise
```

### Relationship Endpoints
```
POST /api/relationships/analyze      # Veteran+
GET /api/relationships/graph         # Veteran+
POST /api/relationships/identify     # Veteran+
GET /api/relationships/people        # Veteran+
```

### Story Generation Endpoints
```
POST /api/stories/generate           # Creator, Veteran, Enterprise
GET /api/stories                     # Creator, Veteran, Enterprise
PUT /api/stories/{id}                # Creator, Veteran, Enterprise
GET /api/stories/templates           # Creator, Veteran, Enterprise
```

### Admin Endpoints
```
GET /api/admin/dashboard             # Enterprise
POST /api/admin/override             # Enterprise
GET /api/admin/audit                 # Enterprise
GET /api/admin/system-health         # Enterprise
POST /api/admin/fallback             # Enterprise
```

## 🔄 Trigger to Container Flow Mapping

### File Upload Flows
```
file.uploaded → FileIntelligenceContainer
├── Standard: GROQ basic processing
├── Pro: Gemini enhanced analysis + folder creation
├── Creator: GPT-4 content optimization + video processing
├── Veteran: Claude semantic analysis + relationship detection
└── Enterprise: Claude Opus maximum accuracy + audit logging
```

### Journal Entry Flows
```
journal.created → JournalingContainer
├── Pro: Gemini emotion analysis + todo extraction
├── Creator: GPT-4 content suggestions + story optimization
├── Veteran: Claude voice processing + agent chaining
└── Enterprise: Claude Opus comprehensive analysis + audit

journal.voice_recorded → JournalingContainer
├── Veteran: Claude voice transcription + analysis
└── Enterprise: Claude Opus voice + full audit trail
```

### Relationship Detection Flows
```
image.face_detected → RelationshipContainer
├── Veteran: Claude face recognition + basic clustering
└── Enterprise: Claude Opus advanced mapping + audit

relationship.mapping_requested → RelationshipContainer
├── Veteran: Claude relationship analysis
└── Enterprise: Claude Opus comprehensive mapping + insights
```

### Story Generation Flows
```
story.generation_requested → StorytellingContainer
├── Creator: GPT-4 content-focused narratives
├── Veteran: Claude narrative chains + relationship stories
└── Enterprise: Claude Opus comprehensive storytelling + analytics

memory.compilation → StorytellingContainer
├── Creator: GPT-4 memory optimization for content
├── Veteran: Claude advanced memory weaving
└── Enterprise: Claude Opus enterprise storytelling + audit
```

### Admin Override Flows
```
admin.override_panel → AdminSupervisorContainer
└── Enterprise: GPT-4o administrative intelligence

system.fallback_required → AdminSupervisorContainer
└── Enterprise: GPT-4o automatic fallback handling

admin.manual_intervention → AdminSupervisorContainer
└── Enterprise: GPT-4o manual system control
```

## 💰 Pricing Feature Value Mapping

### Standard Plan ($9/month) - Entry Level
- **Core Value**: Basic AI file organization
- **Key Features**: File intelligence, smart routing
- **AI Model**: GROQ (cost-effective, fast)
- **Target User**: Individual users, basic organization needs

### Pro Plan ($19/month) - Popular Choice
- **Core Value**: Memory capture and timeline
- **Key Features**: Full journaling, memory timeline, smart folders
- **AI Model**: Gemini 1.5 Pro (enhanced analysis)
- **Target User**: Content creators, memory enthusiasts

### Creator Plan ($14.99/month) - Content Optimized
- **Core Value**: Content creation and optimization
- **Key Features**: Video/audio support, story generation, content optimization
- **AI Model**: GPT-4 (content excellence)
- **Target User**: Content creators, social media managers

### Veteran Plan ($49/month) - Advanced Features
- **Core Value**: Complete workflow management
- **Key Features**: Relationships, voice assistant, API export, agent chaining
- **AI Model**: Claude 3 Sonnet (advanced reasoning)
- **Target User**: Power users, professionals

### Enterprise Plan ($149/month) - Full Control
- **Core Value**: System administration and control
- **Key Features**: Admin dashboard, audit trails, unlimited resources
- **AI Model**: Claude 3 Opus (maximum capability)
- **Target User**: Organizations, enterprise customers

## 🔧 Development Feature Mapping

### Container Development Guidelines
```typescript
// Feature availability check
if (!hasFeature(planName, 'requiredFeature')) {
  throw new Error('Feature not available in current plan');
}

// AI model selection
const aiConfig = getAIConfig(planName);
const model = aiConfig.primaryModel;

// Processing level determination
const level = getProcessingLevel(planName);
```

### UI Component Development
```tsx
// Plan-aware component rendering
{hasFeature(planName, 'storyGeneration') ? (
  <StoryGenerationButton />
) : (
  <UpgradePrompt requiredPlan="veteran" />
)}

// Feature progression display
<FeatureComparison
  currentPlan={planName}
  feature="memoryTimeline"
  availableFrom="pro"
/>
```

This feature mapping ensures consistent feature availability across all components while providing clear upgrade paths for users seeking additional capabilities.