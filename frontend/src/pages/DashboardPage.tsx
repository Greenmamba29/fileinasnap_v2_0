
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const recentFiles = [
    { name: 'Family Vacation 2024.jpg', type: 'image', size: '2.4 MB', date: '2 hours ago', category: 'Photos' },
    { name: 'Project Proposal.pdf', type: 'document', size: '1.8 MB', date: '1 day ago', category: 'Documents' },
    { name: 'Birthday Video.mp4', type: 'video', size: '45.2 MB', date: '3 days ago', category: 'Videos' },
    { name: 'Recipe Collection.docx', type: 'document', size: '890 KB', date: '1 week ago', category: 'Documents' },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return '📸';
      case 'video': return '🎥';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  const QuickUploadModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl relative shadow-2xl"
      >
        <button 
          onClick={() => setShowUploadModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl transition-colors"
        >
          ✕
        </button>
        
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-6"
          >
            <span className="text-4xl">📁</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-inter">Quick Upload</h2>
          
          <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-8 mb-6 hover:border-blue-400 transition-colors">
            <div className="text-center">
              <span className="text-6xl mb-4 block">⬆️</span>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2 font-inter">Drag & drop files here</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">or click to browse</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl font-inter"
            >
              Browse Files
            </motion.button>
            <button
              onClick={() => setShowUploadModal(false)}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-semibold transition-colors font-inter"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className={`min-h-screen font-inter transition-colors duration-200 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📁</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered file organization</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </motion.button>
              
              {/* Quick Upload */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                ⬆️ Quick Upload
              </button>
              
              {/* Notifications */}
              <button className="p-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors shadow-lg relative">
                🔔
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">3</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files, memories, or ask AI..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-colors"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  ⚏
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  ☰
                </button>
              </div>
              
              {/* Filter Panel Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showFilters
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                🔽 Filters
              </button>
            </div>
          </div>
          
          {/* Collapsible Filter Panel */}
          <div className={`overflow-hidden transition-all duration-300 ${
            showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File Type</label>
                  <select className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                    <option>All Types</option>
                    <option>Photos</option>
                    <option>Videos</option>
                    <option>Documents</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
                  <select className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                    <option>All Time</option>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Size</label>
                  <select className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                    <option>Any Size</option>
                    <option>Small (&lt;1MB)</option>
                    <option>Medium (1-10MB)</option>
                    <option>Large (&gt;10MB)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                    <option>All Categories</option>
                    <option>Work</option>
                    <option>Personal</option>
                    <option>Memories</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Files Organized', value: '1,247', icon: '📁', color: 'blue', change: '+12%' },
            { label: 'Storage Used', value: '2.3GB', icon: '💾', color: 'green', change: '+5%' },
            { label: 'Memories', value: '89', icon: '📸', color: 'purple', change: '+8%' },
            { label: 'AI Actions', value: '156', icon: '🤖', color: 'indigo', change: '+24%' }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* File Management Interface */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Files</h2>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
              View All →
            </button>
          </div>
          
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'}>
            {recentFiles.map((file, index) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: viewMode === 'grid' ? 1.02 : 1.01, y: -2 }}
                className={`
                  ${viewMode === 'grid' 
                    ? 'bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600' 
                    : 'bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-4'
                  } 
                  transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600
                `}
              >
                {viewMode === 'grid' ? (
                  <div className="text-center">
                    <div className="text-4xl mb-3">{getFileIcon(file.type)}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 truncate">{file.name}</h3>
                    <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <p>{file.size}</p>
                      <p>{file.date}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        file.category === 'Photos' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        file.category === 'Videos' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {file.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl">{getFileIcon(file.type)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{file.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{file.size} • {file.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      file.category === 'Photos' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      file.category === 'Videos' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {file.category}
                    </span>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Quick Upload Modal */}
      {showUploadModal && <QuickUploadModal />}
    </div>
  );
};

const DashboardPage = () => {
  return <Dashboard />;
};

export default DashboardPage;
