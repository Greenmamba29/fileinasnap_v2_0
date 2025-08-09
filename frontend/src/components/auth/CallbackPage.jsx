import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const CallbackPage = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Authentication successful, redirect handled by Auth0ProviderWithHistory
      // This is just a fallback
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    } else if (!isLoading && error) {
      console.error('Authentication failed:', error);
    } else if (!isLoading && !isAuthenticated && !error) {
      // Authentication incomplete, redirect to home
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    }
  }, [isLoading, isAuthenticated, error, navigate]);

  if (error) {
    console.error('Auth0 callback error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button 
            onClick={() => navigate('/', { replace: true })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isAuthenticated ? 'Welcome back!' : 'Authenticating...'}
        </h1>
        <p className="text-gray-600 mb-4">
          {isAuthenticated 
            ? 'Redirecting you to your dashboard...' 
            : 'Please wait while we complete your sign in...'
          }
        </p>
        <div className="animate-pulse text-sm text-gray-500">
          This should only take a moment
        </div>
      </div>
    </div>
  );
};

export default CallbackPage;
