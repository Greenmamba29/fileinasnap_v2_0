
import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to FileInASnap Dashboard</h1>
          <p className="text-lg text-gray-600">Organize your life's memories with AI-powered intelligence</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                📁 Upload Files
              </button>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                📝 New Journal Entry
              </button>
              <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                📸 View Memory Timeline
              </button>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl mr-3">🤖</span>
                <div>
                  <p className="font-medium">AI organized 15 files</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl mr-3">📸</span>
                <div>
                  <p className="font-medium">New memory timeline created</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Files Organized</span>
                <span className="font-bold text-2xl text-blue-600">1,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Storage Used</span>
                <span className="font-bold text-2xl text-green-600">2.3GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Memories</span>
                <span className="font-bold text-2xl text-purple-600">89</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Assistant</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <p className="text-lg text-gray-700 mb-4">💬 Ask me anything about your files and memories!</p>
            <div className="flex space-x-4">
              <input 
                type="text" 
                placeholder="What are you trying to remember?"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Ask AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  return <Dashboard />;
};

export default DashboardPage;
