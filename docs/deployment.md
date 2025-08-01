# 🚀 FileInASnap Deployment Guide

## Overview

FileInASnap is designed for flexible deployment across multiple environments, from local development to enterprise-scale production. This guide covers deployment strategies, configuration management, and scaling considerations.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Agents     │
│   (React)       │    │   (FastAPI)     │    │   (TypeScript)  │
│   Port: 3000    │◄──►│   Port: 8001    │◄──►│   Orchestrator  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static CDN    │    │   MongoDB       │    │   AI Services   │
│   (Assets)      │    │   (Database)    │    │   (APIs)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🐳 Docker Deployment

### Docker Compose Setup

Create a `docker-compose.yml` for local development:

```yaml
version: '3.8'

services:
  # Frontend
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8001
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

  # Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongo:27017/fileinasnap
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    volumes:
      - ./backend:/app
    depends_on:
      - mongo
      - orchestrator

  # AI Agent Orchestrator
  orchestrator:
    build:
      context: .
      dockerfile: Dockerfile.orchestrator
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
    volumes:
      - ./mobile_classification_app:/app/mobile_classification_app
      - ./pricingConfig.ts:/app/pricingConfig.ts

  # Database
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=fileinasnap

  # Redis for caching and queues
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongo_data:
  redis_data:
```

### Dockerfiles

#### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
```

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

#### Orchestrator Dockerfile
```dockerfile
# Dockerfile.orchestrator
FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY mobile_classification_app ./mobile_classification_app
COPY pricingConfig.ts ./

EXPOSE 3001

CMD ["yarn", "start"]
```

## ☁️ Cloud Deployment

### AWS Deployment

#### ECS with Fargate
```yaml
# aws-ecs-task-definition.json
{
  "family": "fileinasnap-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "fileinasnap/frontend:latest",
      "portMappings": [{"containerPort": 3000}],
      "environment": [
        {"name": "REACT_APP_BACKEND_URL", "value": "https://api.fileinasnap.com"}
      ]
    },
    {
      "name": "backend",
      "image": "fileinasnap/backend:latest",
      "portMappings": [{"containerPort": 8001}],
      "secrets": [
        {"name": "MONGO_URL", "valueFrom": "arn:aws:secretsmanager:region:account:secret:mongo-url"},
        {"name": "OPENAI_API_KEY", "valueFrom": "arn:aws:secretsmanager:region:account:secret:openai-key"}
      ]
    },
    {
      "name": "orchestrator",
      "image": "fileinasnap/orchestrator:latest",
      "secrets": [
        {"name": "OPENAI_API_KEY", "valueFrom": "arn:aws:secretsmanager:region:account:secret:openai-key"},
        {"name": "ANTHROPIC_API_KEY", "valueFrom": "arn:aws:secretsmanager:region:account:secret:anthropic-key"}
      ]
    }
  ]
}
```

#### Infrastructure as Code (Terraform)
```hcl
# main.tf
provider "aws" {
  region = var.aws_region
}

# VPC and Networking
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "fileinasnap-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = true
}

# ECS Cluster
resource "aws_ecs_cluster" "fileinasnap" {
  name = "fileinasnap"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Application Load Balancer
resource "aws_lb" "fileinasnap" {
  name               = "fileinasnap-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = module.vpc.public_subnets
}

# DocumentDB (MongoDB compatible)
resource "aws_docdb_cluster" "fileinasnap" {
  cluster_identifier      = "fileinasnap-docdb"
  engine                 = "docdb"
  master_username        = var.db_username
  master_password        = var.db_password
  backup_retention_period = 7
  preferred_backup_window = "07:00-09:00"
  skip_final_snapshot    = true
  
  vpc_security_group_ids = [aws_security_group.docdb.id]
  db_subnet_group_name   = aws_docdb_subnet_group.fileinasnap.name
}
```

### Google Cloud Platform (GCP)

#### Cloud Run Deployment
```yaml
# cloud-run-frontend.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: fileinasnap-frontend
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: "10"
    spec:
      containers:
      - image: gcr.io/PROJECT_ID/fileinasnap-frontend
        ports:
        - containerPort: 3000
        env:
        - name: REACT_APP_BACKEND_URL
          value: "https://api.fileinasnap.com"
        resources:
          limits:
            cpu: "1000m"
            memory: "512Mi"
```

#### Cloud Build
```yaml
# cloudbuild.yaml
steps:
  # Build Frontend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/fileinasnap-frontend', './frontend']
  
  # Build Backend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/fileinasnap-backend', './backend']
  
  # Build Orchestrator
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/fileinasnap-orchestrator', '-f', 'Dockerfile.orchestrator', '.']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['run', 'deploy', 'fileinasnap-frontend', '--image', 'gcr.io/$PROJECT_ID/fileinasnap-frontend', '--platform', 'managed', '--region', 'us-central1']

images:
  - 'gcr.io/$PROJECT_ID/fileinasnap-frontend'
  - 'gcr.io/$PROJECT_ID/fileinasnap-backend'
  - 'gcr.io/$PROJECT_ID/fileinasnap-orchestrator'
```

### Microsoft Azure

#### Container Apps
```yaml
# azure-container-app.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fileinasnap-config
data:
  REACT_APP_BACKEND_URL: "https://api.fileinasnap.com"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fileinasnap-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fileinasnap
  template:
    metadata:
      labels:
        app: fileinasnap
    spec:
      containers:
      - name: frontend
        image: fileinasnap/frontend:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: fileinasnap-config
      - name: backend
        image: fileinasnap/backend:latest
        ports:
        - containerPort: 8001
        env:
        - name: MONGO_URL
          valueFrom:
            secretKeyRef:
              name: fileinasnap-secrets
              key: mongo-url
```

## 🔧 Configuration Management

### Environment Variables

#### Production Environment
```bash
# .env.production
NODE_ENV=production
LOG_LEVEL=info

# Database
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/fileinasnap
DB_NAME=fileinasnap

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...

# External Integrations
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
MAKE_WEBHOOK_URL=https://hook.us1.make.com/xyz
MAKE_API_KEY=abc123...

# Performance Tuning
MAX_CONCURRENT_AGENTS=10
AGENT_TIMEOUT_MS=60000
RETRY_ATTEMPTS=3

# Security
JWT_SECRET=your-jwt-secret
CORS_ORIGINS=https://fileinasnap.com,https://app.fileinasnap.com
```

### Secrets Management

#### AWS Secrets Manager
```bash
# Store secrets
aws secretsmanager create-secret \
  --name "fileinasnap/api-keys" \
  --description "API keys for FileInASnap" \
  --secret-string '{
    "OPENAI_API_KEY": "sk-...",
    "ANTHROPIC_API_KEY": "sk-ant-...",
    "MONGO_URL": "mongodb+srv://..."
  }'
```

#### Kubernetes Secrets
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: fileinasnap-secrets
type: Opaque
stringData:
  OPENAI_API_KEY: "sk-..."
  ANTHROPIC_API_KEY: "sk-ant-..."
  MONGO_URL: "mongodb+srv://..."
```

## 📊 Monitoring and Observability

### Health Checks

#### Backend Health Check
```python
# backend/health.py
from fastapi import APIRouter
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

router = APIRouter()

@router.get("/health")
async def health_check():
    # Check database connection
    try:
        client = AsyncIOMotorClient(mongo_url)
        await client.admin.command('ping')
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    # Check orchestrator status
    orchestrator_status = check_orchestrator_health()
    
    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "database": db_status,
            "orchestrator": orchestrator_status,
            "ai_services": check_ai_services()
        },
        "version": "1.0.0"
    }
```

#### Orchestrator Health Check
```typescript
// mobile_classification_app/health.ts
export async function healthCheck() {
  const agents = ['fileOrganizerAgent', 'journalAgent', 'relationshipAgent', 'storyAgent'];
  const agentStatus = {};
  
  for (const agent of agents) {
    try {
      const start = Date.now();
      // Simulate agent ping
      await new Promise(resolve => setTimeout(resolve, 10));
      agentStatus[agent] = {
        status: 'healthy',
        responseTime: Date.now() - start
      };
    } catch (error) {
      agentStatus[agent] = {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
  
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    agents: agentStatus
  };
}
```

### Logging

#### Structured Logging
```typescript
// utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'fileinasnap-orchestrator',
    version: process.env.VERSION || '1.0.0'
  },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default logger;
```

### Metrics Collection

#### Prometheus Metrics
```typescript
// metrics/prometheus.ts
import promClient from 'prom-client';

const register = new promClient.Registry();

// Agent execution metrics
const agentExecutionCounter = new promClient.Counter({
  name: 'fileinasnap_agent_executions_total',
  help: 'Total number of agent executions',
  labelNames: ['agent_name', 'plan', 'status'],
  registers: [register]
});

const agentExecutionDuration = new promClient.Histogram({
  name: 'fileinasnap_agent_execution_duration_seconds',
  help: 'Agent execution duration in seconds',
  labelNames: ['agent_name', 'plan'],
  registers: [register]
});

// Plan usage metrics
const planUsageGauge = new promClient.Gauge({
  name: 'fileinasnap_plan_usage',
  help: 'Current plan usage statistics',
  labelNames: ['plan', 'metric_type'],
  registers: [register]
});

export { register, agentExecutionCounter, agentExecutionDuration, planUsageGauge };
```

## 🚀 Scaling Strategies

### Horizontal Scaling

#### Load Balancer Configuration
```nginx
# nginx.conf
upstream frontend {
    server frontend-1:3000;
    server frontend-2:3000;
    server frontend-3:3000;
}

upstream backend {
    server backend-1:8001;
    server backend-2:8001;
    server backend-3:8001;
}

server {
    listen 80;
    server_name fileinasnap.com;
    
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Auto-scaling Configuration
```yaml
# kubernetes/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: fileinasnap-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: fileinasnap-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Database Scaling

#### MongoDB Cluster
```yaml
# mongodb-cluster.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mongodb-config
data:
  mongod.conf: |
    storage:
      dbPath: /data/db
    net:
      port: 27017
      bindIpAll: true
    replication:
      replSetName: "fileinasnap-rs"
    security:
      authorization: enabled
```

## 🔒 Security Considerations

### Network Security
```yaml
# security-policies.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: fileinasnap-network-policy
spec:
  podSelector:
    matchLabels:
      app: fileinasnap
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: load-balancer
    ports:
    - protocol: TCP
      port: 3000
    - protocol: TCP
      port: 8001
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: mongodb
    ports:
    - protocol: TCP
      port: 27017
```

### SSL/TLS Configuration
```yaml
# tls-certificate.yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: fileinasnap-tls
spec:
  secretName: fileinasnap-tls-secret
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - fileinasnap.com
  - api.fileinasnap.com
  - app.fileinasnap.com
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Secrets stored securely
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Load balancer configured
- [ ] Monitoring setup complete

### Post-deployment
- [ ] Health checks passing
- [ ] Logs flowing correctly
- [ ] Metrics being collected
- [ ] Performance tests passed
- [ ] Security scan completed
- [ ] Backup verification

### Rollback Plan
- [ ] Previous version containers tagged
- [ ] Database backup recent
- [ ] Traffic routing tested
- [ ] Rollback procedure documented
- [ ] Team notifications configured

This deployment guide ensures FileInASnap can be reliably deployed and scaled across various cloud platforms while maintaining security and performance standards.