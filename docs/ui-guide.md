# 🎨 FileInASnap UI Guide - Lovable Components

## Design System Overview

FileInASnap uses a **Lovable Design System** focused on intuitive file management and memory preservation. Our UI components are designed to make complex AI workflows feel simple and delightful.

## 🎯 Core Design Principles

### 1. **Memory-First Design**
Every UI element emphasizes the emotional value of files and memories rather than technical file management.

### 2. **Progressive Disclosure**
Features are revealed based on subscription tier, creating natural upgrade paths without overwhelming basic users.

### 3. **AI-Transparent Interactions**
Users understand when and how AI is working on their behalf, building trust and engagement.

## 📱 Component Library

### Upload Components

#### Smart Upload Zone
```jsx
<SmartUploadZone
  planName={user.plan}
  onUpload={handleFileUpload}
  dragActive={isDragging}
  aiProcessing={isProcessing}
>
  <UploadIcon className="w-12 h-12 text-blue-500" />
  <h3 className="text-lg font-semibold">Drop files to organize</h3>
  <p className="text-gray-600">
    {hasFeature(user.plan, 'fileIntelligence') 
      ? 'AI will automatically rename and organize' 
      : 'Files will be stored as-is'}
  </p>
  
  {/* Plan-specific features */}
  {hasFeature(user.plan, 'relationshipMapping') && (
    <Badge variant="premium">Face recognition enabled</Badge>
  )}
</SmartUploadZone>
```

#### Upload Progress Card
```jsx
<UploadProgressCard
  fileName="family_vacation.jpg"
  progress={75}
  aiStage="Analyzing relationships"
  planFeatures={user.planFeatures}
>
  <ProgressBar value={75} className="mb-2" />
  <div className="flex items-center space-x-2">
    <AIProcessingIcon animate />
    <span className="text-sm">Detecting faces in photo...</span>
  </div>
</UploadProgressCard>
```

### Journal Components

#### Memory Capture Interface
```jsx
<MemoryCaptureInterface planName={user.plan}>
  <TextArea
    placeholder="What happened today? Share a memory..."
    value={journalEntry}
    onChange={setJournalEntry}
    className="min-h-32"
  />
  
  {hasFeature(user.plan, 'journaling') && (
    <div className="flex space-x-2 mt-4">
      <VoiceRecordButton onRecording={handleVoiceCapture} />
      <EmotionDetectionToggle enabled={aiAnalysis} />
      <FileReferenceDetector enabled={aiAnalysis} />
    </div>
  )}
  
  <Button 
    onClick={handleSubmit}
    disabled={!hasFeature(user.plan, 'journaling')}
  >
    {hasFeature(user.plan, 'journaling') 
      ? 'Capture Memory' 
      : 'Upgrade for AI Analysis'}
  </Button>
</MemoryCaptureInterface>
```

#### Emotion Analysis Display
```jsx
<EmotionAnalysisCard emotions={analysisResult.emotions}>
  <div className="grid grid-cols-3 gap-4">
    {Object.entries(emotions).map(([emotion, intensity]) => (
      <EmotionMeter
        key={emotion}
        emotion={emotion}
        intensity={intensity}
        icon={getEmotionIcon(emotion)}
      />
    ))}
  </div>
</EmotionAnalysisCard>
```

### Memory Timeline Components

#### Timeline View (Pro+)
```jsx
<MemoryTimeline 
  memories={userMemories}
  planName={user.plan}
  viewMode="chronological"
>
  {memories.map(memory => (
    <TimelineItem
      key={memory.id}
      date={memory.createdAt}
      type={memory.type}
      canExpand={hasFeature(user.plan, 'memoryTimeline')}
    >
      <MemoryPreview
        content={memory.content}
        aiSummary={memory.aiSummary}
        emotions={memory.emotions}
        files={memory.attachedFiles}
      />
      
      {hasFeature(user.plan, 'storyGeneration') && (
        <StoryGenerationButton
          memoryId={memory.id}
          onClick={() => generateStory(memory.id)}
        />
      )}
    </TimelineItem>
  ))}
</MemoryTimeline>
```

#### Memory Card
```jsx
<MemoryCard
  memory={memory}
  planFeatures={user.planFeatures}
  onInteraction={handleMemoryInteraction}
>
  <MemoryHeader
    date={memory.date}
    aiGenerated={memory.aiGenerated}
    confidenceScore={memory.confidenceScore}
  />
  
  <MemoryContent>
    {memory.type === 'photo' && (
      <PhotoMemory
        src={memory.imageUrl}
        faces={hasFeature(user.plan, 'faceRecognition') ? memory.faces : []}
        relationships={memory.relationships}
      />
    )}
    
    {memory.type === 'journal' && (
      <JournalMemory
        text={memory.content}
        emotions={memory.emotions}
        extractedFiles={memory.fileReferences}
      />
    )}
  </MemoryContent>
  
  <MemoryActions>
    <EditButton disabled={!hasFeature(user.plan, 'overrideUI')} />
    <ShareButton />
    <DeleteButton />
  </MemoryActions>
</MemoryCard>
```

### Relationship Mapping Components (Veteran+)

#### Relationship Graph
```jsx
<RelationshipGraph
  people={detectedPeople}
  relationships={relationshipData}
  interactive={hasFeature(user.plan, 'relationshipMapping')}
>
  {people.map(person => (
    <PersonNode
      key={person.id}
      person={person}
      photoCount={person.photoCount}
      relationship={person.relationship}
      onClick={() => showPersonDetails(person.id)}
    >
      <Avatar src={person.avatarUrl} />
      <PersonLabel>{person.name || 'Unknown'}</PersonLabel>
      <RelationshipBadge type={person.relationship} />
    </PersonNode>
  ))}
  
  <RelationshipEdges relationships={relationships} />
</RelationshipGraph>
```

#### Face Recognition Interface
```jsx
<FaceRecognitionInterface
  photo={selectedPhoto}
  detectedFaces={faces}
  onPersonIdentify={handlePersonIdentify}
>
  <PhotoViewer src={photo.url} className="relative">
    {faces.map(face => (
      <FaceBoundingBox
        key={face.id}
        bounds={face.boundingBox}
        identified={face.person !== null}
        onClick={() => identifyPerson(face.id)}
      >
        {face.person ? (
          <PersonLabel>{face.person.name}</PersonLabel>  
        ) : (
          <UnknownPersonPrompt />
        )}
      </FaceBoundingBox>
    ))}
  </PhotoViewer>
</FaceRecognitionInterface>
```

### Story Generation Components (Veteran+)

#### Story Creation Wizard
```jsx
<StoryCreationWizard
  availableMemories={userMemories}
  planName={user.plan}
  onComplete={handleStoryGeneration}
>
  <StepIndicator currentStep={currentStep} totalSteps={4} />
  
  <StoryTypeSelection
    types={STORY_TYPES}
    selected={selectedType}
    onChange={setSelectedType}
  />
  
  <MemorySelection
    memories={availableMemories}
    selected={selectedMemories}
    onChange={setSelectedMemories}
    maxSelections={getMaxMemories(user.plan)}
  />
  
  <PersonSelection
    people={detectedPeople}
    selected={selectedPeople}
    onChange={setSelectedPeople}
    enabled={hasFeature(user.plan, 'relationshipMapping')}
  />
  
  <StoryCustomization
    template={selectedType}
    customization={storyOptions}
    onChange={setStoryOptions}
  />
</StoryCreationWizard>
```

#### Generated Story Display
```jsx
<GeneratedStoryCard
  story={generatedStory}
  canEdit={hasFeature(user.plan, 'overrideUI')}
  onEdit={handleStoryEdit}
>
  <StoryHeader
    title={story.title}
    type={story.type}
    generatedDate={story.createdAt}
    aiModel={getAIConfig(user.plan).primaryModel}
  />
  
  <StoryContent
    narrative={story.narrative}
    highlights={story.highlights}
    includedMemories={story.memories}
  />
  
  <StoryActions>
    <ExportButton formats={['pdf', 'epub', 'html']} />
    <ShareButton />
    <RegenerateButton onClick={regenerateStory} />
  </StoryActions>
</GeneratedStoryCard>
```

### Analytics Components (Enterprise)

#### Analytics Dashboard
```jsx
<AnalyticsDashboard
  data={analyticsData}
  dateRange={selectedDateRange}
  planName={user.plan}
>
  <DashboardHeader>
    <h1>FileInASnap Analytics</h1>
    <DateRangePicker
      value={selectedDateRange}
      onChange={setSelectedDateRange}
    />
  </DashboardHeader>
  
  <MetricsGrid>
    <MetricCard
      title="Files Organized"
      value={metrics.totalFiles}
      change={metrics.filesChange}
      icon={<FileIcon />}
    />
    
    <MetricCard
      title="AI Accuracy"
      value={`${metrics.aiAccuracy}%`}
      change={metrics.accuracyChange}
      icon={<AIIcon />}
    />
    
    <MetricCard
      title="Storage Used"
      value={formatStorage(metrics.storageUsed)}
      change={metrics.storageChange}
      icon={<StorageIcon />}
    />
  </MetricsGrid>
  
  <ChartsGrid>
    <AgentPerformanceChart data={metrics.agentPerformance} />
    <UserEngagementChart data={metrics.userEngagement} />
    <CostOptimizationChart data={metrics.costBreakdown} />
  </ChartsGrid>
</AnalyticsDashboard>
```

#### Agent Performance Monitor
```jsx
<AgentPerformanceMonitor agents={agentMetrics}>
  {agents.map(agent => (
    <AgentStatusCard
      key={agent.name}
      agent={agent}
      status={agent.status}
      metrics={agent.metrics}
    >
      <AgentHeader>
        <AgentIcon type={agent.type} />
        <AgentName>{agent.displayName}</AgentName>
        <StatusBadge status={agent.status} />
      </AgentHeader>
      
      <AgentMetrics>
        <Metric label="Success Rate" value={`${agent.successRate}%`} />
        <Metric label="Avg Response" value={`${agent.avgResponseTime}ms`} />
        <Metric label="Invocations" value={agent.totalInvocations} />
      </AgentMetrics>
      
      <AgentActions>
        <RestartButton onClick={() => restartAgent(agent.name)} />
        <ViewLogsButton onClick={() => viewAgentLogs(agent.name)} />
      </AgentActions>
    </AgentStatusCard>
  ))}
</AgentPerformanceMonitor>
```

## 🎨 Design Tokens

### Color Palette
```scss
:root {
  // Primary colors - Memory & Intelligence theme
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  // Secondary colors - Warmth & Memory
  --color-secondary-50: #fef3c7;
  --color-secondary-500: #f59e0b;
  --color-secondary-900: #78350f;
  
  // AI Processing states
  --color-ai-processing: #8b5cf6;
  --color-ai-success: #10b981;
  --color-ai-error: #ef4444;
  
  // Plan tier colors
  --color-standard: #6b7280;
  --color-pro: #3b82f6;
  --color-veteran: #8b5cf6;
  --color-enterprise: #f59e0b;
}
```

### Typography Scale
```scss
:root {
  // Font families
  --font-primary: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  // Font scales
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
}
```

### Spacing System
```scss
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
}
```

## 📱 Responsive Design

### Breakpoints
```scss
$breakpoints: (
  'mobile': 320px,
  'tablet': 768px,
  'desktop': 1024px,
  'wide': 1280px
);
```

### Mobile-First Components
All components are designed mobile-first with progressive enhancement:

```jsx
<ResponsiveContainer>
  {/* Mobile layout */}
  <div className="block md:hidden">
    <MobileUploadInterface />
  </div>
  
  {/* Tablet+ layout */}
  <div className="hidden md:block lg:hidden">
    <TabletUploadInterface />
  </div>
  
  {/* Desktop layout */}
  <div className="hidden lg:block">
    <DesktopUploadInterface />
  </div>
</ResponsiveContainer>
```

## ♿ Accessibility Features

### ARIA Implementation
```jsx
<UploadZone
  role="button"
  tabIndex={0}
  aria-label="Upload files for AI organization"
  aria-describedby="upload-help"
  onKeyDown={handleKeyDown}
>
  <span id="upload-help" className="sr-only">
    Press space or enter to select files, or drag and drop files here
  </span>
</UploadZone>
```

### Keyboard Navigation
- **Tab order**: Logical flow through all interactive elements
- **Focus indicators**: Clear visual focus states
- **Keyboard shortcuts**: Power user shortcuts for common actions

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA labels**: Descriptive labels for complex interactions
- **Live regions**: Dynamic content announcements

## 🌟 Animation & Microinteractions

### AI Processing Animations
```jsx
<AIProcessingIndicator>
  <div className="animate-pulse">
    <BrainIcon className="w-6 h-6" />
  </div>
  <span className="animate-fade-in">
    Analyzing your memory...
  </span>
</AIProcessingIndicator>
```

### File Upload Transitions
```scss
.upload-card {
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  &.uploading {
    animation: pulse-border 2s infinite;
  }
}

@keyframes pulse-border {
  0%, 100% { border-color: var(--color-primary-300); }
  50% { border-color: var(--color-primary-500); }
}
```

This UI guide ensures FileInASnap provides a delightful, accessible, and plan-aware experience that grows with users as they upgrade their subscriptions.