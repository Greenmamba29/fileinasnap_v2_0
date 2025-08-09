import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="mb-8">
          <span className="text-9xl">🔍</span>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              🏠 Back to Home
            </a>
            <a 
              href="/dashboard" 
              className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              📊 Go to Dashboard
            </a>
          </div>
          
          <div className="mt-8 text-gray-500">
            <p className="mb-2">Or try these popular pages:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/journal" className="text-blue-600 hover:underline">📝 Journal</a>
              <a href="/timeline" className="text-blue-600 hover:underline">📸 Memory Timeline</a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600">
            If you think this is a mistake, contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
