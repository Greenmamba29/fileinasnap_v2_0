# 📡 FileInASnap API Reference

## Overview

FileInASnap provides a comprehensive REST API for integrating with external services, managing subscriptions, and orchestrating AI agents. The API is designed with plan-aware endpoints that respect subscription tiers and feature gating.

## Base URL

```
Production: https://api.fileinasnap.com
Development: http://localhost:8001/api
```

## Authentication

All API requests require authentication using Bearer tokens:

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     https://api.fileinasnap.com/api/files
```

## Plan-Aware Endpoints

### Subscription Management

#### Get Current Plan
```http
GET /api/subscription/current
```

**Response:**
```json
{
  "plan": {
    "id": "pro",
    "name": "Pro",
    "pricePerMonth": 19,
    "features": {
      "fileIntelligence": true,
      "journaling": true,
      "relationshipMapping": false
    },
    "limits": {
      "maxStorageGB": 25,
      "maxMonthlyUploads": 1000,
      "maxUsers": 3
    }
  },
  "usage": {
    "storageUsedGB": 12.5,
    "uploadsThisMonth": 245,
    "usersCount": 2
  }
}
```

#### Get Available Plans
```http
GET /api/subscription/plans
```

### File Intelligence API

#### Upload and Process File
```http
POST /api/files/upload
Content-Type: multipart/form-data
```

**Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@vacation.jpg" \
  -F "options={\"autoOrganize\": true}" \
  http://localhost:8001/api/files/upload
```

**Response:**
```json
{
  "file": {
    "id": "file_abc123",
    "originalName": "vacation.jpg",
    "newName": "2025_NYC_Family_Vacation.jpg",
    "size": 2048576,
    "mimeType": "image/jpeg"
  },
  "metadata": {
    "tags": ["family", "vacation", "nyc", "photo"],
    "summary": "Family vacation photo taken in New York City",
    "confidenceScore": 0.92,
    "suggestedDestination": "Family/Vacations/2025",
    "aiModel": "gpt-4",
    "processingTime": 1250
  },
  "features": {
    "textExtracted": "Welcome to Central Park",
    "objectsDetected": ["person", "building", "tree"],
    "colorPalette": ["#4A90E2", "#F5A623", "#7ED321"]
  }
}
```

#### Get File Metadata
```http
GET /api/files/{fileId}
```

#### Update File Organization
```http
PUT /api/files/{fileId}/organize
```

**Request:**
```json
{
  "newName": "Custom_File_Name.jpg",
  "tags": ["custom", "tag"],
  "destination": "Custom/Folder"
}
```

### Journal API (Pro+)

#### Create Journal Entry
```http
POST /api/journal/entries
```

**Request:**
```json
{
  "content": "Today was amazing! We visited Central Park...",
  "type": "text",
  "voiceRecordingUrl": "https://storage.com/recording.wav"
}
```

**Response:**
```json
{
  "entry": {
    "id": "journal_xyz789",
    "content": "Today was amazing! We visited Central Park...",
    "createdAt": "2025-03-15T14:30:00Z"
  },
  "analysis": {
    "summary": "Positive experience visiting Central Park with family",
    "emotions": {
      "joy": 0.8,
      "excitement": 0.6,
      "contentment": 0.7
    },
    "extractedFiles": [
      {
        "name": "central_park_photo.jpg",
        "link": "/files/abc123"
      }
    ],
    "recommendedDestination": "Personal/Happy Memories"
  }
}
```

#### Get Journal Timeline
```http
GET /api/journal/timeline?startDate=2025-01-01&endDate=2025-12-31
```

### Relationship API (Veteran+)

#### Analyze Image for Faces
```http
POST /api/relationships/analyze
Content-Type: multipart/form-data
```

**Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@family_photo.jpg" \
  http://localhost:8001/api/relationships/analyze
```

**Response:**
```json
{
  "analysis": {
    "facesDetected": 3,
    "people": [
      {
        "id": "person_1",
        "faceId": "face_abc123",
        "name": "John Doe",
        "relationship": "family",
        "confidence": 0.95,
        "boundingBox": {
          "x": 100,
          "y": 150,
          "width": 200,
          "height": 250
        }
      }
    ],
    "groups": {
      "family": ["person_1", "person_2"],
      "friends": ["person_3"]
    }
  }
}
```

#### Get Relationship Graph
```http
GET /api/relationships/graph
```

### Story Generation API (Veteran+)

#### Generate Story
```http
POST /api/stories/generate
```

**Request:**
```json
{
  "type": "seasonalChronicles",
  "files": ["file_1", "file_2", "file_3"],
  "people": ["person_1", "person_2"],
  "timeRange": {
    "start": "2025-06-01",
    "end": "2025-08-31"
  },
  "notes": "Summer vacation memories",
  "style": "narrative"
}
```

**Response:**
```json
{
  "story": {
    "id": "story_def456",
    "title": "Summer Adventures 2025",
    "type": "seasonalChronicles",
    "narrative": "The summer of 2025 began with anticipation...",
    "highlights": [
      "First day at the beach",
      "Camping under the stars",  
      "Road trip to the mountains"
    ],
    "generatedAt": "2025-03-15T16:45:00Z",
    "aiModel": "claude-3-sonnet"
  },
  "includedMemories": 15,
  "processingTime": 5200
}
```

#### Get Generated Stories
```http
GET /api/stories?type=seasonalChronicles&limit=10
```

### Analytics API (Enterprise)

#### Get Dashboard Data
```http
GET /api/analytics/dashboard
```

**Response:**
```json
{
  "overview": {
    "totalFiles": 1250,
    "totalAgentInvocations": 3450,
    "averageProcessingTime": 850,
    "successRate": 0.985
  },
  "agentPerformance": {
    "fileOrganizerAgent": {
      "invocations": 1250,
      "successRate": 0.99,
      "averageResponseTime": 650
    },
    "journalAgent": {
      "invocations": 450,
      "successRate": 0.97,
      "averageResponseTime": 1200
    }
  },
  "usage": {
    "storageUsed": 45.2,
    "apiCallsThisMonth": 2847,
    "uploadsThisMonth": 156
  },
  "costs": {
    "aiProcessing": 234.56,
    "storageAndCompute": 45.78,
    "totalThisMonth": 280.34
  }
}
```

#### Export Data
```http
GET /api/analytics/export?format=json&dateRange=last30days
```

### Agent Orchestration API

#### Trigger Specific Agent
```http
POST /api/agents/{agentName}/execute
```

**Request:**
```json
{
  "input": {
    "fileId": "file_abc123"
  },
  "options": {
    "priority": "high",
    "timeout": 30000
  }
}
```

#### Get Agent Status
```http
GET /api/agents/status
```

**Response:**
```json
{
  "agents": [
    {
      "name": "fileOrganizerAgent",
      "status": "running",
      "queueLength": 3,
      "lastHeartbeat": "2025-03-15T16:30:00Z",
      "averageResponseTime": 650
    }
  ]
}
```

## Webhooks

### Make.com Integration

FileInASnap sends webhooks to Make.com for workflow automation:

#### File Processed
```json
{
  "event": "file.processed",
  "timestamp": "2025-03-15T16:30:00Z",
  "data": {
    "fileId": "file_abc123",
    "userId": "user_xyz789",
    "planName": "pro",
    "metadata": {
      "newName": "Organized_File.jpg",
      "tags": ["ai-processed"],
      "destination": "Smart Folder"
    }
  }
}
```

#### Journal Entry Analyzed
```json
{
  "event": "journal.analyzed",
  "timestamp": "2025-03-15T16:35:00Z",
  "data": {
    "entryId": "journal_def456",
    "userId": "user_xyz789",
    "emotions": {
      "dominant": "joy",
      "score": 0.8
    },
    "extractedFiles": ["file_ghi789"]
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "FEATURE_NOT_AVAILABLE",
    "message": "Relationship mapping requires Veteran plan or higher",
    "details": {
      "currentPlan": "pro",
      "requiredPlan": "veteran",
      "feature": "relationshipMapping"
    }
  }
}
```

### Common Error Codes

- `FEATURE_NOT_AVAILABLE`: Feature not included in current plan
- `QUOTA_EXCEEDED`: Usage limit exceeded for current plan
- `INVALID_FILE_TYPE`: Unsupported file format
- `AI_SERVICE_UNAVAILABLE`: AI model temporarily unavailable
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Rate Limits

Rate limits are based on subscription plan:

| Plan | Requests/minute | Burst |
|------|----------------|-------|
| Standard | 10 | 20 |
| Pro | 30 | 60 |
| Veteran | 100 | 200 |
| Enterprise | 1000 | 2000 |

## SDKs and Examples

### JavaScript/Node.js
```javascript
import { FileInASnapAPI } from '@fileinasnap/sdk';

const client = new FileInASnapAPI({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.fileinasnap.com'
});

// Upload and process file
const result = await client.files.upload({
  file: fileBuffer,
  options: { autoOrganize: true }
});

console.log('File processed:', result.metadata.newName);
```

### Python
```python
from fileinasnap import FileInASnapClient

client = FileInASnapClient(api_key='your-api-key')

# Upload file
with open('photo.jpg', 'rb') as f:
    result = client.files.upload(f, auto_organize=True)
    
print(f"New filename: {result.metadata.new_name}")
```

### cURL Examples

See individual endpoint documentation above for complete cURL examples.

## Testing

Use our sandbox environment for testing:

```
Sandbox Base URL: https://sandbox-api.fileinasnap.com
Test API Key: test_sk_1234567890abcdef
```

All sandbox requests simulate processing without actual AI costs or storage usage.