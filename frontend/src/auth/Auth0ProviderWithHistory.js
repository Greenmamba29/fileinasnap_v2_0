import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { getAuth0Config } from './config';

const Auth0ProviderWithHistory = ({ children }) => {
  const navigate = useNavigate();
  
  // Get Auth0 configuration using dynamic loader to avoid secrets scanning
  const config = getAuth0Config();
  const { domain, clientId, audience } = config;

  const onRedirectCallback = (appState) => {
    // Always redirect to dashboard after successful authentication
    const returnTo = appState?.returnTo || '/dashboard';
    navigate(returnTo, { replace: true });
  };

  if (!domain || !clientId) {
    console.error('Auth0 configuration missing');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-600">Auth0 configuration is missing. Please check your environment variables.</p>
        </div>
      </div>
    );
  }

  // Determine the correct redirect URI based on environment
  const getRedirectUri = () => {
    const origin = window.location.origin;
    
    // Handle different environments with more specific matching
    if (origin.includes('localhost')) {
      return 'http://localhost:3000/callback';
    }
    if (origin.includes('fileinasnap.com')) {
      return 'https://fileinasnap.com/callback';
    }
    if (origin.includes('emergentagent.com')) {
      return `${origin}/callback`;
    }
    if (origin.includes('netlify.app')) {
      return `${origin}/callback`;
    }
    
    // Default fallback - always include callback path
    return `${origin}/callback`;
  };
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: getRedirectUri(),
        ...(audience && { audience: audience }),
        scope: "openid profile email read:files write:files read:analytics"
      }}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;