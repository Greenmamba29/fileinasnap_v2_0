import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Auth0Diagnostics = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    getIdTokenClaims
  } = useAuth0();

  const [accessToken, setAccessToken] = useState(null);
  const [idTokenClaims, setIdTokenClaims] = useState(null);
  const [tokenError, setTokenError] = useState(null);

  // Get tokens for debugging
  useEffect(() => {
    const getTokens = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          setAccessToken(token);
          
          const claims = await getIdTokenClaims();
          setIdTokenClaims(claims);
        } catch (err) {
          setTokenError(err.message);
        }
      }
    };

    getTokens();
  }, [isAuthenticated, getAccessTokenSilently, getIdTokenClaims]);

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: '/auth0-diagnostics'
      }
    });
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin + '/auth0-diagnostics'
      }
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Auth0 Diagnostics</h1>
          
          {/* Configuration Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuration</h2>
            <div className="bg-gray-100 rounded-lg p-4 space-y-2">
              <div><strong>Domain:</strong> {process.env.REACT_APP_AUTH0_DOMAIN || 'Not set'}</div>
              <div><strong>Client ID:</strong> {process.env.REACT_APP_AUTH0_CLIENT_ID || 'Not set'}</div>
              <div><strong>Audience:</strong> {process.env.REACT_APP_AUTH0_AUDIENCE || 'Not set'}</div>
              <div><strong>Current URL:</strong> {window.location.href}</div>
              <div><strong>Origin:</strong> {window.location.origin}</div>
            </div>
          </div>

          {/* Authentication Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Authentication Status</h2>
            <div className="bg-gray-100 rounded-lg p-4">
              {isLoading && (
                <div className="text-blue-600">
                  <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  Loading...
                </div>
              )}
              
              {!isLoading && (
                <div className="space-y-2">
                  <div>
                    <strong>Authenticated:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${isAuthenticated ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {isAuthenticated ? 'Yes' : 'No'}
                    </span>
                  </div>
                  
                  {error && (
                    <div className="text-red-600">
                      <strong>Error:</strong> {error.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* User Information */}
          {isAuthenticated && user && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information</h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Name:</strong> {user.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div>
                    <strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <strong>Sub:</strong> {user.sub}
                  </div>
                </div>
                
                {user.picture && (
                  <div className="mt-4">
                    <img src={user.picture} alt="Profile" className="w-16 h-16 rounded-full" />
                  </div>
                )}
                
                <details className="mt-4">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">View Full User Object</summary>
                  <pre className="mt-2 bg-white p-2 rounded border text-sm overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                  <button 
                    onClick={() => copyToClipboard(JSON.stringify(user, null, 2))}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Copy User Object
                  </button>
                </details>
              </div>
            </div>
          )}

          {/* Tokens */}
          {isAuthenticated && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tokens</h2>
              <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                {tokenError && (
                  <div className="text-red-600">
                    <strong>Token Error:</strong> {tokenError}
                  </div>
                )}
                
                {accessToken && (
                  <div>
                    <h3 className="font-semibold">Access Token:</h3>
                    <div className="bg-white p-2 rounded border mt-1">
                      <code className="text-sm break-all">{accessToken.substring(0, 100)}...</code>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(accessToken)}
                      className="mt-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      Copy Full Token
                    </button>
                  </div>
                )}
                
                {idTokenClaims && (
                  <div>
                    <h3 className="font-semibold">ID Token Claims:</h3>
                    <pre className="bg-white p-2 rounded border mt-1 text-sm overflow-auto">
                      {JSON.stringify(idTokenClaims, null, 2)}
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(idTokenClaims, null, 2))}
                      className="mt-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      Copy Claims
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {!isAuthenticated ? (
              <button
                onClick={handleLogin}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Log In with Auth0
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Log Out
              </button>
            )}
            
            <a
              href="/"
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth0Diagnostics;
