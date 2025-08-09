
import React from 'react';
import QuickStartPanel from './dashboard/QuickStartPanel';
import RecentActivityFeed from './dashboard/RecentActivityFeed';
import MemoryAssistant from './dashboard/MemoryAssistant';
import AITaskQueue from './dashboard/AITaskQueue';
import FloatingActionBar from './dashboard/FloatingActionBar';
import DashboardHeader from './dashboard/DashboardHeader';
import CreatorPanel from './dashboard/CreatorPanel';
<<<<<<< HEAD
import MCPIntegrationPanel from './dashboard/MCPIntegrationPanel';
import { type UserPlan, hasFeatureAccess } from '@/lib/featureConfig';

const Dashboard = () => {
  // Mock user data - in real app this would come from auth/database
  // Using 'standard' plan to demonstrate proper tier gating
  const user: UserPlan = {
    plan: 'standard',
    creatorTrack: false, // This would be set based on onboarding selection
=======
import { type UserPlan } from '@/lib/featureConfig';

const Dashboard = () => {
  // Mock user data - in real app this would come from auth/database
  const user: UserPlan = {
    plan: 'pro',
    creatorTrack: true, // This would be set based on onboarding selection
>>>>>>> 72681af89fe1c601033e42c7ed839ff339df0a6f
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Creator Panel - Full Width at Top */}
        <div className="mb-8">
          <CreatorPanel user={user} />
        </div>
        
<<<<<<< HEAD
        {/* MCP Integration Panel - Full Width */}
        {hasFeatureAccess(user, 'mcpIntegration') && (
          <div className="mb-8">
            <MCPIntegrationPanel user={user} />
          </div>
        )}
        
=======
>>>>>>> 72681af89fe1c601033e42c7ed839ff339df0a6f
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <QuickStartPanel />
            <RecentActivityFeed />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <MemoryAssistant user={user} />
            <AITaskQueue />
          </div>
        </div>
      </main>
      
      <FloatingActionBar />
    </div>
  );
};

export default Dashboard;
