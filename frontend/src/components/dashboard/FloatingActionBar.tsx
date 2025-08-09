
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, X, Upload, Sparkles } from 'lucide-react';
import UploadModal from '@/components/upload/UploadModal';

const FloatingActionBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const agentActions = [
    { 
      icon: Upload, 
      label: 'Smart Upload', 
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => setIsUploadModalOpen(true)
    },
    { 
      icon: BookOpen, 
      label: 'Journal Entry', 
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('Journal Entry')
    },
    { 
      icon: Sparkles, 
      label: 'Story Agent', 
      color: 'bg-amber-500 hover:bg-amber-600',
      action: () => console.log('Story Agent')
    }
  ];

  return (
    <>
      {/* Main Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-end space-y-3">
          {/* Expanded Actions */}
          {isExpanded && (
            <div className="flex flex-col items-end space-y-2 animate-fade-in">
              {agentActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={action.label}
                    className={`${action.color} text-white px-4 py-3 rounded-full shadow-lg hover-lift glow-pulse animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={action.action}
                  >
                    <IconComponent className="w-5 h-5 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
              
              {/* SnapBot Chat Button */}
              <Button
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg hover-lift glow-pulse animate-fade-in"
                style={{ animationDelay: '0.3s' }}
                onClick={() => setIsChatOpen(true)}
              >
                <span className="mr-2">🫰</span>
                Ask SnapBot
              </Button>
            </div>
          )}
          
          {/* Main Toggle Button */}
          <Button
            className={`${
              isExpanded ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700 glow-blue'
            } text-white w-14 h-14 rounded-full shadow-lg hover-lift transition-all duration-300`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <X className="w-6 h-6" />
            ) : (
              <Plus className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* SnapBot Chat Overlay */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🫰</span>
                <div>
                  <h3 className="text-lg font-space font-semibold">SnapBot Assistant</h3>
                  <p className="text-xs text-gray-500">Powered by FileInASnap AI</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  👋 Hi! I'm your AI memory assistant. I can help you find files, organize memories, or answer questions about your collection using our agent container system.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 glow-pulse">
                <p className="text-sm text-blue-700">
                  🤖 <strong>Agent Update:</strong> FileOrganizer is processing 2 files in the background!
                </p>
              </div>
              
              <input
                type="text"
                placeholder="What are you trying to remember?"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </>
  );
};

export default FloatingActionBar;
