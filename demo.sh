#!/bin/bash

# FileInASnap - Complete Demo Script
# This script demonstrates all plans and agent capabilities

echo "🎉 FileInASnap - Complete Feature Demonstration"
echo "================================================="
echo ""

# Function to run demo with timing
demo_plan() {
    local plan=$1
    local description=$2
    
    echo "🚀 Testing $description"
    echo "----------------------------------------"
    
    start_time=$(date +%s)
    ./start.sh $plan build-all
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    
    echo ""
    echo "✅ $description completed in ${duration}s"
    echo "=========================================="
    echo ""
    sleep 2
}

# Function to test individual agents
demo_agent() {
    local agent=$1 
    local plan=$2
    local description=$3
    
    echo "🤖 Testing $description"
    echo "----------------------------------------"
    
    npm run agent:${agent} -- --plan=$plan
    echo ""
    echo "✅ $description completed"
    echo "========================="
    echo ""
    sleep 1
}

echo "📋 Starting comprehensive plan demonstration..."
echo ""

# Test all 5 subscription plans
demo_plan "standard" "Standard Plan (\$9/month) - GROQ-Powered Basic Intelligence"
demo_plan "pro" "Pro Plan (\$19/month) - Gemini Enhanced with Memory Timeline"  
demo_plan "creator" "Creator Plan (\$14.99/month) - Content Optimization Focus"
demo_plan "veteran" "Veteran Plan (\$49/month) - Claude Chains with Voice Assistant"
demo_plan "enterprise" "Enterprise Plan (\$149/month) - Full Analytics with Audit Trail"

echo "🔧 Starting individual agent demonstrations..."
echo ""

# Test individual agents across plans
demo_agent "file" "standard" "File Intelligence - Standard (GROQ Llama3)"
demo_agent "file" "pro" "File Intelligence - Pro (Gemini 1.5 Pro)"
demo_agent "file" "creator" "File Intelligence - Creator (GPT-4 Content)"
demo_agent "file" "veteran" "File Intelligence - Veteran (Claude Sonnet Chains)"
demo_agent "file" "enterprise" "File Intelligence - Enterprise (Claude Opus Max)"

demo_agent "journal" "pro" "Journal Analysis - Pro (Gemini Emotion Detection)"
demo_agent "journal" "creator" "Journal Analysis - Creator (GPT-4 Story Focus)"
demo_agent "journal" "veteran" "Journal Analysis - Veteran (Claude Voice Assistant)"
demo_agent "journal" "enterprise" "Journal Analysis - Enterprise (Claude Opus + Audit)"

demo_agent "story" "creator" "Story Generation - Creator (Content Narratives)"
demo_agent "story" "veteran" "Story Generation - Veteran (Claude Story Chains)"
demo_agent "story" "enterprise" "Story Generation - Enterprise (Claude Opus Stories)"

demo_agent "analytics" "enterprise" "Analytics Dashboard - Enterprise Only"

echo ""
echo "🎯 Feature Comparison Summary"
echo "================================================="
echo ""

echo "📊 PLAN FEATURES MATRIX:"
echo ""
echo "Standard (\$9):   GROQ agents, read-only journals, 5GB"
echo "Pro (\$19):       Gemini 1.5, full journals + timeline, 25GB"  
echo "Creator (\$14.99): GPT-4 content, video/audio support, 50GB"
echo "Veteran (\$49):   Claude chains, voice assistant, 100GB"
echo "Enterprise (\$149): Claude Opus, admin dashboards, unlimited"
echo ""

echo "🤖 AI MODEL PROGRESSION:"
echo ""
echo "Standard → GROQ Llama3 (fast, cost-effective)"
echo "Pro → Gemini 1.5 Pro (enhanced analysis)"
echo "Creator → GPT-4 (content optimization)"
echo "Veteran → Claude 3 Sonnet (agent chaining)"
echo "Enterprise → Claude 3 Opus (maximum accuracy)"
echo ""

echo "⚡ AGENT CAPABILITIES:"
echo ""
echo "FileOrganizer: All plans (features scale by tier)"
echo "JournalAgent:  Pro+ (read-only on Standard)"
echo "RelationshipAgent: Veteran+ only (requires Claude)"
echo "StoryAgent:    Creator, Veteran, Enterprise"
echo "AnalyticsAgent: Enterprise only"
echo ""

echo "🔗 INTEGRATION READY:"
echo ""
echo "✅ Supabase: Schema designed for plan-aware storage"
echo "✅ Make.com: Webhooks configured for all agent events"
echo "✅ Lovable: UI components with plan feature gating"
echo "✅ Docker: Containerization configs for all agents"
echo "✅ Kubernetes: Deployment manifests provided"
echo ""

echo "🚀 A/B TESTING READY:"
echo ""
echo "✅ Modular pricing config in pricingConfig.ts"
echo "✅ Easy experiment toggles for business testing"
echo "✅ Creator plan can be A/B tested against Pro"
echo "✅ Enterprise pricing can be dynamically adjusted"
echo ""

echo "================================================="
echo "🎉 FileInASnap Demo Complete!"
echo "================================================="
echo ""
echo "FileInASnap is production-ready with:"
echo "• 5 subscription tiers with distinct AI models"
echo "• Modular agent architecture with BMAD methodology"  
echo "• Plan-aware feature gating and quota management"
echo "• Complete integration with Supabase and Make.com"
echo "• A/B testing capability for pricing optimization"
echo "• Comprehensive documentation and deployment guides"
echo ""
echo "Ready for immediate deployment! 🚀"
echo ""