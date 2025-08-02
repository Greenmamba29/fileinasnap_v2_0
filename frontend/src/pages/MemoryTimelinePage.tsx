
import React, { useState } from 'react';

const MemoryTimelinePage = () => {
  const [memories, setMemories] = useState([
    {
      id: 1,
      date: '2025-08-02',
      title: 'Summer Vacation Photos',
      description: 'AI organized 150 vacation photos into 5 beautiful memory collections',
      images: ['🏖️', '🌅', '🌊'],
      tags: ['vacation', 'photos', 'summer'],
      aiInsight: 'These photos show a wonderful 7-day beach vacation with themes of relaxation and family bonding.'
    },
    {
      id: 2,
      date: '2025-07-28',
      title: 'Birthday Celebration',
      description: 'Family birthday party with 45 photos and 3 videos automatically grouped',
      images: ['🎂', '🎈', '🎁'],
      tags: ['birthday', 'family', 'celebration'],
      aiInsight: 'A joyful celebration capturing moments of surprise, laughter, and family togetherness.'
    },
    {
      id: 3,
      date: '2025-07-15',
      title: 'Work Project Success',
      description: 'Documents and screenshots from completed project milestone',
      images: ['📊', '💼', '🎯'],
      tags: ['work', 'achievement', 'project'],
      aiInsight: 'Professional milestone showing growth in project management and team collaboration.'
    }
  ]);

  const [selectedMemory, setSelectedMemory] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'grid'

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">📸 Memory Timeline</h1>
          <p className="text-lg text-gray-600">Your life's moments, organized by AI intelligence</p>
          
          {/* View Mode Toggle */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'timeline' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📅 Timeline View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔲 Grid View
            </button>
          </div>
        </div>

        {/* Memory Timeline */}
        <div className={viewMode === 'timeline' ? 'space-y-8' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
          {memories.map((memory, index) => (
            <div 
              key={memory.id} 
              className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${
                viewMode === 'timeline' ? 'p-6' : 'p-4'
              }`}
              onClick={() => setSelectedMemory(memory)}
            >
              {/* Timeline Connector for Timeline View */}
              {viewMode === 'timeline' && index < memories.length - 1 && (
                <div className="absolute left-8 top-full w-0.5 h-8 bg-blue-200"></div>
              )}
              
              <div className="flex items-start space-x-4">
                {viewMode === 'timeline' && (
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{memory.images[0]}</span>
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{memory.title}</h3>
                    <span className="text-sm text-gray-500">{memory.date}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{memory.description}</p>
                  
                  {/* Memory Images */}
                  <div className="flex space-x-2 mb-3">
                    {memory.images.map((image, idx) => (
                      <div 
                        key={idx}
                        className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl"
                      >
                        {image}
                      </div>
                    ))}
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap space-x-2 mb-3">
                    {memory.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* AI Insight */}
                  {viewMode === 'timeline' && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-blue-600">🤖 AI Insight:</span> {memory.aiInsight}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Memory Detail Modal */}
        {selectedMemory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedMemory.title}</h2>
                <button 
                  onClick={() => setSelectedMemory(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <span className="text-gray-500 text-sm">{selectedMemory.date}</span>
                <p className="text-gray-700 mt-2">{selectedMemory.description}</p>
              </div>
              
              {/* Large Memory Images */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {selectedMemory.images.map((image, idx) => (
                  <div 
                    key={idx}
                    className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl"
                  >
                    {image}
                  </div>
                ))}
              </div>
              
              {/* AI Insight */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-600 mb-2">🤖 AI Analysis</h3>
                <p className="text-gray-700">{selectedMemory.aiInsight}</p>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedMemory.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  📝 Add to Journal
                </button>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  🔗 Share Memory
                </button>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  🎬 Create Story
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex space-x-4 justify-center">
          <a href="/" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            ← Back to Home
          </a>
          <a href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            📊 Dashboard
          </a>
          <a href="/journal" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            📝 Journal
          </a>
        </div>
      </div>
    </div>
  );
};

export default MemoryTimelinePage;
