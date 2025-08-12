import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { authedFetch } from '../../lib/authedFetch';
import { apiService } from '../../lib/apiService';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  X, 
  RefreshCw,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Simple unique ID generator
const createId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const UploadModal = ({ isOpen, onClose, selectedFolder: initialFolder, onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(initialFolder?.id || '');
  const [newFolderName, setNewFolderName] = useState('');
  const [progress, setProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [folderError, setFolderError] = useState(null);
  
  const api = process.env.REACT_APP_BACKEND_URL || '/api';

  const loadFolders = async () => {
    setFolderError(null);
    setLoadingFolders(true);
    try {
      // Try using the API service first
      const data = await apiService.getFolders();
      setFolders(data || []);
      // auto-select first folder if any
      if (!selectedFolder && data?.length) setSelectedFolder(data[0].id);
    } catch (e) {
      try {
        // Fallback to original API call
        const res = await authedFetch(`${api}/folders`);
        const data = await res.json();
        setFolders(data || []);
        // auto-select first folder if any
        if (!selectedFolder && data?.length) setSelectedFolder(data[0].id);
      } catch (fallbackError) {
        setFolders([]);
        setFolderError(
          fallbackError.message === "NOT_AUTHENTICATED"
            ? "Please sign in to load your folders."
            : "Failed to load folders. Please try again."
        );
      }
    } finally {
      setLoadingFolders(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadFolders();
  }, [isOpen]);

  const ensureFolder = async () => {
    // Allow uploads even if load failed — user can still create a folder
    if (!newFolderName.trim()) return selectedFolder;
    try {
      // Try using API service first
      const created = await apiService.createFolder(newFolderName.trim());
      setFolders((f) => [created, ...f]);
      setSelectedFolder(created.id);
      setNewFolderName("");
      return created.id;
    } catch (e) {
      // Fallback to original API call
      const body = JSON.stringify({ name: newFolderName.trim() });
      const created = await authedFetch(`${api}/folders`, { method: "POST", body }).then((r) => r.json());
      setFolders((f) => [created, ...f]);
      setSelectedFolder(created.id);
      setNewFolderName("");
      return created.id;
    }
  };

  const startUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    try {
      const folderId = await ensureFolder();
      for (const file of files) {
        const key = `${createId()}-${file.name}`;
        const presign = await authedFetch(
          `${api}/uploads/presign?folder_id=${folderId}&filename=${encodeURIComponent(key)}`
        ).then((r) => r.json());

        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", presign.url, true);
          xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setProgress((p) => ({ ...p, [key]: Math.round((e.loaded / e.total) * 100) }));
            }
          };
          xhr.onload = async () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              await authedFetch(`${api}/uploads/complete`, {
                method: "POST",
                body: JSON.stringify({
                  folder_id: folderId,
                  filename: file.name,
                  object_key: presign.object_key,
                  bytes: file.size,
                  mime: file.type,
                }),
              });
              resolve();
            } else reject(new Error(`Upload failed (${xhr.status})`));
          };
          xhr.onerror = () => reject(new Error("Network error"));
          xhr.send(file);
        });
      }
      setFiles([]);
      setProgress({});
      if (onUploadComplete) {
        onUploadComplete();
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Upload failed. See console for details.");
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    // Clear progress for removed file
    const fileName = files[index]?.name;
    if (fileName) {
      setProgress(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (key.includes(fileName)) {
            delete updated[key];
          }
        });
        return updated;
      });
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5 text-green-500" />;
    if (file.type.includes('pdf') || file.type.includes('document')) return <FileText className="w-5 h-5 text-purple-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={uploading ? () => {} : onClose}>
      <DialogContent className="w-full max-w-3xl bg-white shadow-2xl z-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4">Upload Files</DialogTitle>
        </DialogHeader>

        {/* Error banner (non-blocking) */}
        {folderError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 flex items-center justify-between">
            <span>{folderError}</span>
            <button
              onClick={loadFolders}
              className="rounded-lg px-2 py-1 text-red-700 hover:bg-red-100 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: dropzone */}
          <div 
            className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-neutral-200 hover:border-blue-300 hover:bg-blue-50/30'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <div className="font-medium text-gray-900">
              {dragActive ? 'Drop files here' : 'Drag & drop files'}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {dragActive ? '' : 'or click to browse'}
            </div>
            <label className="inline-block">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
              <span className="cursor-pointer rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 font-medium transition-colors">
                Choose Files
              </span>
            </label>

            {!!files.length && (
              <div className="mt-6 max-h-48 overflow-y-auto space-y-3 text-left border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Files ({files.length})</h4>
                {files.map((f, index) => {
                  const key = Object.keys(progress).find((k) => k.includes(f.name));
                  const pct = key ? progress[key] ?? 0 : 0;
                  return (
                    <div key={`${f.name}-${index}`} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(f)}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-40" title={f.name}>
                            {f.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(f.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {pct > 0 && (
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 font-medium">{pct}%</span>
                          </div>
                        )}
                        {pct === 100 && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        <button
                          onClick={() => removeFile(index)}
                          disabled={uploading && pct > 0}
                          className="text-gray-400 hover:text-red-500 disabled:opacity-50 h-6 w-6 p-0 flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: folder selection */}
          <div>
            <label className="text-sm font-medium">Choose Folder</label>
            <div className="mt-1">
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                disabled={loadingFolders}
                className="w-full rounded-xl border p-2"
              >
                <option value="">
                  {loadingFolders ? "Loading…" : folders.length ? "Select…" : "No folders"}
                </option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Or create new folder"
                className="flex-1 rounded-xl border p-2"
              />
              <button
                onClick={() => ensureFolder()}
                disabled={!newFolderName.trim()}
                className="rounded-xl px-4 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50"
              >
                +
              </button>
            </div>

            <div className="mt-6 text-sm">
              <div className="opacity-70">Suggested Tags (auto after upload)</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">#vacation</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">#family</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">#memories</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button 
            onClick={onClose} 
            disabled={uploading} 
            className="rounded-xl px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={startUpload}
            disabled={!files.length || uploading || (!selectedFolder && !newFolderName.trim())}
            className="rounded-xl px-4 py-2 bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700"
          >
            {uploading ? "Uploading…" : "Upload Files"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
