import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UploadModal from '../components/upload/UploadModal';
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  File,
  Search, 
  Calendar, 
  Settings,
  User,
  LogOut,
  Home,
  Folder,
  FolderPlus,
  Grid,
  List,
  Filter,
  Download,
  Share2,
  MoreVertical,
  Eye,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  ChevronDown,
  Plus,
  X
} from 'lucide-react';
import { Card } from '../components/ui/card';
import FilterPanel from '../components/filters/FilterPanel';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({ folders: 0, files: 0, total_bytes: 0, total_mb: 0 });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [postUploadPromptOpen, setPostUploadPromptOpen] = useState(false);
  const [lastUploadedFileIds, setLastUploadedFileIds] = useState([]);
  const [autoCreatedQuickUploads, setAutoCreatedQuickUploads] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Fetch data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const { apiService } = await import('../lib/apiService');
      
      const [foldersData, statsData] = await Promise.all([
        apiService.getFolders(),
        apiService.getStats()
      ]);

      setFolders(foldersData);
      setStats({
        folders: statsData.folders,
        files: statsData.files,
        total_bytes: statsData.total_bytes,
        total_mb: statsData.total_mb
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const { apiService } = await import('../lib/apiService');
      const newFolder = await apiService.createFolder(newFolderName.trim());
      
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setShowNewFolderInput(false);
      showNotification(`Folder "${newFolder.name}" created successfully!`);
      loadDashboardData(); // Refresh stats
    } catch (error) {
      console.error('Failed to create folder:', error);
      showNotification('Failed to create folder', 'error');
    }
  };

  const loadFolderFiles = async (folderId) => {
    try {
      const { apiService } = await import('../lib/apiService');
      const filesData = await apiService.getFiles(folderId);
      setFiles(filesData);
    } catch (error) {
      console.error('Failed to load folder files:', error);
      showNotification('Failed to load files', 'error');
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      await handleFileUpload(droppedFiles);
    }
  };

  const handleFileUpload = async (filesToUpload) => {
    if (!filesToUpload || filesToUpload.length === 0) return;
    
    // Auto-create "Quick Uploads" folder if no folder selected
    let targetFolder = selectedFolder;
    if (!targetFolder) {
      const quickUploadsFolder = folders.find(f => f.name === 'Quick Uploads');
      if (quickUploadsFolder) {
        targetFolder = quickUploadsFolder;
      } else {
        // Create Quick Uploads folder
        try {
          const { apiService } = await import('../lib/apiService');
          targetFolder = await apiService.createFolder('Quick Uploads');
          setFolders([...folders, targetFolder]);
          setAutoCreatedQuickUploads(true);
        } catch (error) {
          console.error('Failed to create Quick Uploads folder:', error);
          showNotification('Failed to create upload folder', 'error');
          return;
        }
      }
    }

    showNotification(`Uploading ${filesToUpload.length} file(s)...`, 'info');
    
    try {
      const { apiService } = await import('../lib/apiService');
      
      // Upload files in parallel for better performance
      const uploadPromises = Array.from(filesToUpload).map(file => 
        apiService.uploadFile(file, targetFolder.id)
      );
      
      const uploadResults = await Promise.all(uploadPromises);
      const uploadedIds = uploadResults.map(r => r?.id).filter(Boolean);
      setLastUploadedFileIds(uploadedIds);
      
      showNotification(`Successfully uploaded ${filesToUpload.length} file(s)!`);
      loadDashboardData();
      if (selectedFolder) {
        loadFolderFiles(selectedFolder.id);
      }
      // If we auto-created Quick Uploads, offer to create a folder and move files
      if (autoCreatedQuickUploads && uploadedIds.length > 0) {
        setPostUploadPromptOpen(true);
        setAutoCreatedQuickUploads(false);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      showNotification('Upload failed', 'error');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  // Move last uploaded files from Quick Uploads to a new folder
  const moveLastUploadsToNewFolder = async (folderName) => {
    if (!folderName || lastUploadedFileIds.length === 0) {
      setPostUploadPromptOpen(false);
      return;
    }
    try {
      const { apiService } = await import('../lib/apiService');
      const newFolder = await apiService.createFolder(folderName.trim());
      // Bulk update files to new folder
      await supabase
        .from('files')
        .update({ folder_id: newFolder.id })
        .in('id', lastUploadedFileIds);
      showNotification(`Moved ${lastUploadedFileIds.length} file(s) to "${newFolder.name}"`);
      setPostUploadPromptOpen(false);
      setLastUploadedFileIds([]);
      // Refresh
      if (selectedFolder) {
        await loadFolderFiles(selectedFolder.id);
      } else {
        await loadDashboardData();
      }
    } catch (e) {
      console.error('Move files failed:', e);
      showNotification('Failed to move uploaded files', 'error');
      setPostUploadPromptOpen(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Upload Modal */}
      {uploadModalOpen && (
        <UploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          selectedFolder={selectedFolder}
          onUploadComplete={loadDashboardData}
        />
      )}
      
      {/* Global Drag Overlay */}
      {dragActive && (
        <div className="fixed inset-0 z-50 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 border-2 border-dashed border-blue-400 max-w-md text-center">
            <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop files to upload</h3>
            <p className="text-gray-600">Files will be uploaded to {selectedFolder?.name || 'Quick Uploads'}</p>
          </div>
        </div>
      )}
      
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-40 max-w-sm">
          <div className={`p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
            notification.type === 'success' ? 'bg-green-100 border border-green-200 text-green-800' :
            notification.type === 'error' ? 'bg-red-100 border border-red-200 text-red-800' :
            'bg-blue-100 border border-blue-200 text-blue-800'
          }`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {notification.type === 'info' && <Clock className="w-5 h-5" />}
            <span className="text-sm font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-xl text-gray-900">FileInASnap</span>
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {['light','system','dark'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-2 py-1 rounded text-xs capitalize ${theme === t ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300'}`}
                    title={`Theme: ${t}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Notification Button with dropdown */}
              <div className="relative">
                <button
                  className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:shadow-glow transition-all"
                  title="Notifications"
                  onClick={async () => {
                    setNotificationsOpen((v) => !v);
                    if (!notificationsOpen && recentActivity.length === 0) {
                      try {
                        const { apiService } = await import('../lib/apiService');
                        const items = await apiService.getRecentActivity(10);
                        setRecentActivity(items);
                      } catch (e) { console.error(e); }
                    }
                  }}
                >
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-pink-500 shadow-glow" />
                  <span className="text-xs font-semibold">•</span>
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl z-50">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-800 text-sm font-medium">Recent Activity</div>
                    <div className="max-h-80 overflow-auto divide-y divide-gray-100 dark:divide-gray-800">
                      {recentActivity.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500">No recent activity</div>
                      ) : recentActivity.map((a) => (
                        <div key={a.id} className="p-3 text-sm">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{a.description || a.item_name}</div>
                          <div className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Upload Button with Glow */}
              <button
                onClick={() => setUploadModalOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:shadow-xl font-medium"
              >
                <Upload className="w-4 h-4" />
                <span>Quick Upload</span>
              </button>
              
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <span className="text-sm text-gray-600">Hello, {user?.email?.split('@')[0]}!</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Post-upload prompt to create folder and move files */}
      {postUploadPromptOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Move uploads to a new folder?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">We noticed you uploaded files to Quick Uploads. Create a folder and we’ll move them for you.</p>
            <div className="flex gap-2 items-center">
              <input id="new-folder-name" type="text" placeholder="e.g. Vacation 2025" className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setPostUploadPromptOpen(false)} className="px-4 py-2 rounded border border-gray-200 dark:border-gray-800">Skip</button>
              <button onClick={() => {
                const name = document.getElementById('new-folder-name')?.value?.trim();
                moveLastUploadsToNewFolder(name);
              }} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Create folder & move</button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Filter Panel */}
      <FilterPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        folders={folders}
        initialFilters={activeFilters}
        onApply={async (f) => {
          setActiveFilters(f);
          setFiltersOpen(false);
          try {
            const { apiService } = await import('../lib/apiService');
            const results = await apiService.searchFiles('', f);
            setFiles(results);
          } catch (e) {
            console.error('Filter apply failed', e);
          }
        }}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Photo Library</h1>
          <p className="text-xl text-gray-600">Organize, search, and relive your memories with AI</p>
        </div>

        {/* Search Bar with Filters Toggle */}
        <Card className="mb-8 p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-lg">
          <div className="relative flex items-center gap-3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your photos, videos, and documents..."
              className="w-full pl-12 pr-4 py-4 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={() => setFiltersOpen(v => !v)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors ${filtersOpen ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0"
            onClick={() => setUploadModalOpen(true)}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload Files</h3>
                <p className="text-sm text-gray-600">Add photos, videos & docs</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Smart Search</h3>
                <p className="text-sm text-gray-600">Find anything instantly</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Timeline</h3>
                <p className="text-sm text-gray-600">Browse by date</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-600 rounded-lg group-hover:bg-orange-700 transition-colors">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Customize your experience</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Folders Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Folders</h2>
            <button
              onClick={() => setShowNewFolderInput(!showNewFolderInput)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
          </div>
          
          {/* New folder input */}
          {showNewFolderInput && (
            <Card className="p-4 mb-4 bg-gray-50 border border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      createFolder();
                    }
                  }}
                />
                <button
                  onClick={createFolder}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowNewFolderInput(false);
                    setNewFolderName('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </Card>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
              ))}
            </div>
          ) : folders.length === 0 ? (
            <Card className="p-8 text-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-lg">
              <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No folders yet</h3>
              <p className="text-gray-500 mb-4">Create your first folder to start organizing your files</p>
              <button
                onClick={() => setShowNewFolderInput(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Create Folder
              </button>
            </Card>
          ) : (
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {folders.map(folder => (
                <Card
                  key={folder.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-0 ${
                    selectedFolder?.id === folder.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md' 
                      : 'bg-white/70 dark:bg-gray-900/70 hover:bg-white/90 dark:hover:bg-gray-900'
                  } ${
                    viewMode === 'list' ? 'p-4 flex items-center space-x-4' : 'p-6 text-center'
                  }`}
                  onClick={() => {
                    setSelectedFolder(folder);
                    loadFolderFiles(folder.id);
                  }}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="relative mb-4">
                        <Folder className={`w-16 h-16 mx-auto ${
                          selectedFolder?.id === folder.id ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'
                        }`} />
                        {folder.file_count > 0 && (
                          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            {folder.file_count}
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{folder.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {folder.file_count || 0} file{(folder.file_count || 0) !== 1 ? 's' : ''}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <Folder className={`w-8 h-8 ${
                          selectedFolder?.id === folder.id ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'
                        }`} />
                        {folder.file_count > 0 && (
                          <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {folder.file_count}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{folder.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {folder.file_count || 0} file{(folder.file_count || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Files Section - shown when folder is selected */}
        {selectedFolder && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    setSelectedFolder(null);
                    setFiles([]);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← Back to folders
                </button>
                <h3 className="text-xl font-semibold text-gray-900">Files in "{selectedFolder.name}"</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{files.length} files</span>
              </div>
            </div>
            
            {files.length === 0 ? (
              <Card className="p-8 text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files in this folder</h3>
                <p className="text-gray-500 mb-4">Drag and drop files here or click to upload</p>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Upload Files
                </button>
              </Card>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {files.map(file => (
                  <Card
                    key={file.id}
                  className={`group hover:shadow-lg transition-all duration-200 border-0 bg-white/70 dark:bg-gray-900/70 hover:bg-white/90 dark:hover:bg-gray-900 ${
                      viewMode === 'list' ? 'p-4 flex items-center space-x-4' : 'p-4'
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="relative mb-4">
                          {file.type === 'image' ? (
                            <div className="w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                              <img 
                                src={file.thumbnail_url || file.public_url} 
                                alt={file.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="w-full h-full bg-blue-100 flex items-center justify-center" style={{display: 'none'}}>
                                <Image className="w-8 h-8 text-blue-500" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                              {file.type === 'video' && <Video className="w-12 h-12 text-green-500" />}
                              {file.type === 'document' && <FileText className="w-12 h-12 text-purple-500" />}
                              {!['image', 'video', 'document'].includes(file.type) && <File className="w-12 h-12 text-gray-500" />}
                            </div>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate" title={file.name}>
                          {file.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="flex justify-between items-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600">
                              <Eye className="w-4 h-4" />
                            </button>
                          <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-green-600">
                              <Download className="w-4 h-4" />
                            </button>
                          <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                          <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-shrink-0">
                          {file.type === 'image' ? (
                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                              <img 
                                src={file.thumbnail_url || file.public_url} 
                                alt={file.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="w-full h-full bg-blue-100 flex items-center justify-center" style={{display: 'none'}}>
                                <Image className="w-6 h-6 text-blue-500" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              {file.type === 'video' && <Video className="w-6 h-6 text-green-500" />}
                              {file.type === 'document' && <FileText className="w-6 h-6 text-purple-500" />}
                              {!['image', 'video', 'document'].includes(file.type) && <File className="w-6 h-6 text-gray-500" />}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate" title={file.name}>
                            {file.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Stats and Recent Activity - Only show when no folder is selected */}
        {!selectedFolder && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Stats */}
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                Library Stats
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Folder className="w-8 h-8 text-blue-600" />
                    <span className="font-medium text-gray-900">Folders</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{stats.folders || folders.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-green-600" />
                    <span className="font-medium text-gray-900">Files</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats.files}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-8 h-8 text-purple-600" />
                    <span className="font-medium text-gray-900">Storage</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">
                    {stats.total_mb ? `${stats.total_mb.toFixed(1)}MB` : '0MB'}
                  </span>
                </div>
              </div>
            </Card>

          {/* Recent Activity */}
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Uploaded 12 photos from vacation</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Search className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">AI organized beach photos</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Created timeline for 2024</p>
                  <p className="text-sm text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        )}

        {/* AI Assistant - Only show when no folder is selected */}
        {!selectedFolder && (
        <Card className="p-8 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 border-0 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Assistant</h2>
            <p className="text-gray-600">Ask me anything about your photos and memories!</p>
          </div>
          <div className="flex space-x-4 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="flex-1 px-6 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
              Ask AI
            </button>
          </div>
        </Card>
        )}
      </main>
    </div>
  );
};

const DashboardPage = () => {
  return <Dashboard />;
};

export default DashboardPage;
