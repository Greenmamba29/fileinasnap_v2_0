import React, { useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FileUpload = ({ onUploadSuccess, onUploadError }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Remove data:mime;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Convert file to base64
      setUploadProgress(25);
      const base64Content = await handleFileToBase64(file);
      
      setUploadProgress(50);
      
      // Get access token
      const token = await getAccessTokenSilently();
      
      setUploadProgress(75);

      // Upload file
      const response = await axios.post(`${API}/files/upload`, {
        name: file.name,
        content: base64Content,
        mime_type: file.type,
        size: file.size
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUploadProgress(100);
      
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

    } catch (error) {
      console.error('Upload error:', error);
      if (onUploadError) {
        onUploadError(error.response?.data?.detail || 'Upload failed');
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFile(files[0]); // Upload first file only for now
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }
          ${uploading ? 'pointer-events-none opacity-75' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && document.getElementById('file-input').click()}
      >
        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <div className="space-y-2">
              <p className="text-gray-600">Uploading file...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl text-gray-400">📁</div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragOver ? 'Drop file here' : 'Drop files here or click to browse'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports: Images, PDFs, Documents, Videos (Max: 50MB)
              </p>
            </div>
          </div>
        )}
        
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,application/pdf,text/*,.doc,.docx,video/*"
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default FileUpload;