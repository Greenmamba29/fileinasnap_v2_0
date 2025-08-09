/**
 * Smart Upload Zone - Lovable Connected Component
 * Plan-aware file upload with real-time AI processing feedback
 */

import React, { useState, useCallback, useRef } from 'react';
import { PlanName, hasFeature, getPricingTier } from '../../pricingConfig';

interface SmartUploadZoneProps {
  planName: PlanName;
  onUpload: (file: File) => Promise<void>;
  onProcessingComplete?: (result: any) => void;
  maxFileSizeMb?: number;
  acceptedTypes?: string[];
  className?: string;
}

interface UploadProgress {
  file: File;
  progress: number;
  aiStage: string;
  estimatedTime?: number;
  features: string[];
}

export const SmartUploadZone: React.FC<SmartUploadZoneProps> = ({
  planName,
  onUpload,
  onProcessingComplete,
  maxFileSizeMb = 100,
  acceptedTypes = ['image/*', 'video/*', 'audio/*', 'text/*', 'application/pdf'],
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [processingQueue, setProcessingQueue] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const planInfo = getPricingTier(planName);
  
  // Get plan-specific features
  const planFeatures = {
    fileIntelligence: hasFeature(planName, 'fileIntelligence'),
    smartFolderRouting: hasFeature(planName, 'smartFolderRouting'),
    smartFolderCreation: hasFeature(planName, 'smartFolderCreation'),
    aiModel: planInfo.aiConfig.primaryModel,
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  }, []);

  const processFiles = useCallback(async (files: File[]) => {
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxFileSizeMb * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size: ${maxFileSizeMb}MB`);
        return false;
      }
      
      // Check file type
      const fileType = file.type || `application/${file.name.split('.').pop()}`;
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', ''));
        }
        return fileType === type;
      });
      
      if (!isAccepted) {
        alert(`File type ${fileType} is not supported`);
        return false;
      }
      
      return true;
    });

    for (const file of validFiles) {
      await processFile(file);
    }
  }, [maxFileSizeMb, acceptedTypes]);

  const processFile = useCallback(async (file: File) => {
    // Initialize progress tracking
    const progress: UploadProgress = {
      file,
      progress: 0,
      aiStage: 'Preparing upload...',
      features: getFileProcessingFeatures(planName, file),
    };
    
    setUploadProgress(prev => [...prev, progress]);
    
    try {
      // Stage 1: Upload (20%)
      progress.progress = 20;
      progress.aiStage = 'Uploading file...';
      setUploadProgress(prev => prev.map(p => p.file.name === file.name ? progress : p));
      
      await onUpload(file);
      
      // Stage 2: AI Analysis (40%)
      progress.progress = 40;
      progress.aiStage = `Analyzing with ${planFeatures.aiModel}...`;
      setUploadProgress(prev => prev.map(p => p.file.name === file.name ? progress : p));
      
      // Simulate AI processing stages based on plan
      if (planFeatures.fileIntelligence) {
        await simulateAIProcessing(progress, planName);
      }
      
      // Stage 3: Complete (100%)
      progress.progress = 100;
      progress.aiStage = 'Processing complete!';
      setUploadProgress(prev => prev.map(p => p.file.name === file.name ? progress : p));
      
      // Simulate result callback
      if (onProcessingComplete) {
        const mockResult = generateMockResult(file, planName);
        onProcessingComplete(mockResult);
      }
      
      // Remove from progress after 3 seconds
      setTimeout(() => {
        setUploadProgress(prev => prev.filter(p => p.file.name !== file.name));
      }, 3000);
      
    } catch (error) {
      progress.aiStage = `Error: ${error.message}`;
      progress.progress = 0;
      setUploadProgress(prev => prev.map(p => p.file.name === file.name ? progress : p));
    }
  }, [planName, onUpload, onProcessingComplete, planFeatures]);

  const simulateAIProcessing = async (progress: UploadProgress, plan: PlanName) => {
    const stages = getProcessingStages(plan);
    const stageIncrement = 60 / stages.length; // 60% for AI processing
    
    for (let i = 0; i < stages.length; i++) {
      progress.progress = 40 + (i + 1) * stageIncrement;
      progress.aiStage = stages[i];
      setUploadProgress(prev => prev.map(p => p.file.name === progress.file.name ? progress : p));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };

  const getProcessingStages = (plan: PlanName): string[] => {
    switch (plan) {
      case 'standard':
        return ['GROQ analysis...', 'Generating tags...', 'Basic routing...'];
      case 'pro':
        return ['Gemini analysis...', 'Advanced tagging...', 'Smart folder creation...', 'Memory timeline...'];
      case 'creator':
        return ['GPT-4 content analysis...', 'Video processing...', 'Audio transcription...', 'Story optimization...'];
      case 'veteran':
        return ['Claude semantic analysis...', 'Agent chaining...', 'Relationship mapping...', 'Advanced routing...'];
      case 'enterprise':
        return ['Claude Opus processing...', 'Enterprise analysis...', 'Audit logging...', 'Advanced insights...'];
      default:
        return ['Processing...'];
    }
  };

  const getFileProcessingFeatures = (plan: PlanName, file: File): string[] => {
    const features = ['Smart naming'];
    
    if (hasFeature(plan, 'smartFolderRouting')) features.push('Auto-routing');
    if (hasFeature(plan, 'smartFolderCreation')) features.push('Folder creation');
    if (file.type.startsWith('image/') && hasFeature(plan, 'relationshipMapping')) {
      features.push('Face recognition');
    }
    if (hasFeature(plan, 'storyGeneration')) features.push('Story integration');
    
    return features;
  };

  const generateMockResult = (file: File, plan: PlanName) => {
    const processingLevel = {
      'standard': 1,
      'pro': 2,
      'creator': 2.5,
      'veteran': 3,
      'enterprise': 4
    }[plan] || 1;
    
    return {
      originalName: file.name,
      newName: `AI_${new Date().toISOString().split('T')[0]}_${file.name}`,
      tags: ['ai-processed', file.type.split('/')[0]],
      folder: processingLevel >= 3 ? 'Smart/AI-Organized' : 'Uploads',
      confidence: 0.5 + (processingLevel * 0.1),
      aiModel: planInfo.aiConfig.primaryModel,
      processingLevel
    };
  };

  return (
    <div className={`smart-upload-zone ${className}`}>
      {/* Plan Information Banner */}
      <div className="plan-banner bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">
              {planInfo.name} Plan - ${planInfo.pricePerMonth}/month
            </h3>
            <p className="text-sm text-gray-600">
              AI Model: {planFeatures.aiModel} • 
              {planFeatures.smartFolderCreation ? ' Smart Folders' : ' Basic Routing'} • 
              {planFeatures.fileIntelligence ? ' AI Intelligence' : ' Standard Processing'}
            </p>
          </div>
          {planInfo.popular && (
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          )}
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`upload-zone border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="upload-icon mb-4">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Drop files to organize with AI
        </h3>
        
        <p className="text-gray-600 mb-4">
          {planFeatures.fileIntelligence 
            ? `${planFeatures.aiModel} will automatically rename and organize your files`
            : 'Files will be uploaded and stored'
          }
        </p>
        
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
          Choose Files
        </button>
        
        <p className="text-xs text-gray-500 mt-2">
          Max {maxFileSizeMb}MB • {acceptedTypes.join(', ')}
        </p>
        
        {/* Plan-specific feature badges */}
        <div className="feature-badges mt-4 flex flex-wrap justify-center gap-2">
          {planFeatures.fileIntelligence && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              AI Intelligence
            </span>
          )}
          {planFeatures.smartFolderRouting && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
              Smart Routing
            </span>
          )}
          {planFeatures.smartFolderCreation && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              Auto Folders
            </span>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="upload-progress mt-6 space-y-4">
          <h4 className="font-semibold text-gray-800">Processing Files</h4>
          {uploadProgress.map((progress) => (
            <div key={progress.file.name} className="progress-item bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{progress.file.name}</span>
                <span className="text-sm text-gray-500">{progress.progress}%</span>
              </div>
              
              <div className="progress-bar bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {progress.progress < 100 && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                  )}
                  <span className="text-sm text-gray-600">{progress.aiStage}</span>
                </div>
                
                <div className="feature-list text-xs text-gray-500">
                  {progress.features.join(' • ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};