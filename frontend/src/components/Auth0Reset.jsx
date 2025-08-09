import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Auth0Reset = () => {
  const { logout } = useAuth0();

  const forceReset = () => {
    // Clear all Auth0 related data
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.origin);
    
    // Force logout and redirect
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const clearCacheAndReload = () => {
    // Clear Auth0 cache
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear URL and reload
    window.history.replaceState({}, '', window.location.origin);
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-red-900 text-white p-4 rounded-lg shadow-lg max-w-xs z-50">
      <h3 className="text-sm font-bold mb-3">Auth0 Stuck? Reset Here</h3>
      
      <div className="space-y-2">
        <button
          onClick={clearCacheAndReload}
          className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-xs font-medium"
        >
          Clear Cache & Reload
        </button>
        
        <button
          onClick={forceReset}
          className="w-full bg-red-800 hover:bg-red-900 px-3 py-2 rounded text-xs font-medium"
        >
          Force Logout & Reset
        </button>
        
        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-xs font-medium"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Auth0Reset;
