import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
  const navigate = useNavigate();
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  const onRedirectCallback = (appState) => {
<<<<<<< HEAD
    // Always redirect to dashboard after successful authentication
    const returnTo = appState?.returnTo || '/dashboard';
    
    // Clean navigation to dashboard
=======
    // More specific redirect handling to prevent overlay issues
    const returnTo = appState?.returnTo || '/dashboard';
>>>>>>> 72681af89fe1c601033e42c7ed839ff339df0a6f
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

<<<<<<< HEAD
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
    
    // Default fallback - always include callback path
    return `${origin}/callback`;
  };

=======
>>>>>>> 72681af89fe1c601033e42c7ed839ff339df0a6f
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
<<<<<<< HEAD
        redirect_uri: getRedirectUri(),
        ...(audience && { audience: audience }),
=======
        redirect_uri: window.location.origin,
        audience: audience,
>>>>>>> 72681af89fe1c601033e42c7ed839ff339df0a6f
        scope: "openid profile email read:files write:files read:analytics"
      }}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={true}
      cacheLocation="localstorage"
<<<<<<< HEAD
=======
      // Remove skipRedirectCallback to prevent Auth0 overlay issues
>>>>>>> 72681af89fe1c601033e42c7ed839ff339df0a6f
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;