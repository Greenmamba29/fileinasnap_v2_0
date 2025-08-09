
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Settings, User } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">📁</span>
              </div>
              <div>
                <h1 className="text-xl font-space font-bold text-gray-900">
                  FileInASnap
                </h1>
                <p className="text-xs text-gray-500">AI File Intelligence</p>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Standard Plan
              </div>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                Groq LLM
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>
            
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
