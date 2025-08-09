import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Auth0Diagnostics = () => {
  const { isLoading, isAuthenticated, user, error, loginWithRedirect, logout } = useAuth0();

  const config = {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    currentUrl: window.location.origin,
    redirectUri: `${window.location.origin}/callback`
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Auth0 Configuration Diagnostics</h1>
        
        {/* Configuration Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-2">
            <div className="flex">
              <span className="w-32 font-medium">Domain:</span>
              <span className={config.domain ? 'text-green-600' : 'text-red-600'}>
                {config.domain || '❌ Missing'}
              </span>
            </div>
            <div className="flex">
              <span className="w-32 font-medium">Client ID:</span>
              <span className={config.clientId ? 'text-green-600' : 'text-red-600'}>
                {config.clientId ? '✅ Set' : '❌ Missing'}
              </span>
            </div>
            <div className="flex">
              <span className="w-32 font-medium">Audience:</span>
              <span className={config.audience ? 'text-green-600' : 'text-yellow-600'}>
                {config.audience || '⚠️ Not set (optional)'}
              </span>
            </div>
            <div className="flex">
              <span className="w-32 font-medium">Redirect URI:</span>
              <span className="text-blue-600">{config.redirectUri}</span>
            </div>
          </div>
        </div>

        {/* Auth Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <div className="flex">
              <span className="w-32 font-medium">Loading:</span>
              <span className={isLoading ? 'text-yellow-600' : 'text-green-600'}>
                {isLoading ? '⏳ Loading...' : '✅ Ready'}
              </span>
            </div>
            <div className="flex">
              <span className="w-32 font-medium">Authenticated:</span>
              <span className={isAuthenticated ? 'text-green-600' : 'text-gray-600'}>
                {isAuthenticated ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            {error && (
              <div className="flex">
                <span className="w-32 font-medium">Error:</span>
                <span className="text-red-600">❌ {error.message}</span>
              </div>
            )}
            {user && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">User Information:</h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div>Name: {user.name}</div>
                  <div>Email: {user.email}</div>
                  <div>Email Verified: {user.email_verified ? '✅' : '❌'}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-x-4">
            {!isAuthenticated ? (
              <button
                onClick={() => loginWithRedirect()}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors"
              >
                Test Login
              </button>
            ) : (
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Test Logout
              </button>
            )}
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-yellow-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">Troubleshooting</h2>
          <div className="text-yellow-700 space-y-2 text-sm">
            <p><strong>Required Auth0 Settings:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Allowed Callback URLs: <code>{config.redirectUri}</code></li>
              <li>Allowed Logout URLs: <code>{config.currentUrl}</code></li>
              <li>Allowed Web Origins: <code>{config.currentUrl}</code></li>
              <li>Application Type: Single Page Application</li>
              <li>Token Endpoint Authentication Method: None</li>
            </ul>
            <p className="mt-4"><strong>Common Issues:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Missing redirect URIs in Auth0 dashboard</li>
              <li>Wrong application type (should be SPA)</li>
              <li>Environment variables not loading</li>
              <li>Network/CORS issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth0Diagnostics;
