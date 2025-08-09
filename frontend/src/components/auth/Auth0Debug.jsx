import React from 'react';

const Auth0Debug = () => {
  const origin = window.location.origin;
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  // Same function as in Auth0Provider
  const getRedirectUri = () => {
    if (origin.includes('localhost')) {
      return 'http://localhost:3000/callback';
    }
    if (origin.includes('fileinasnap.com')) {
      return 'https://fileinasnap.com/callback';
    }
    if (origin.includes('emergentagent.com')) {
      return `${origin}/callback`;
    }
    return `${origin}/callback`;
  };

  const debugInfo = {
    currentOrigin: origin,
    domain,
    clientId,
    audience,
    calculatedRedirectUri: getRedirectUri(),
    expectedAuthUrl: `https://${domain}/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(getRedirectUri())}&response_type=code&scope=openid%20profile%20email%20read%3Afiles%20write%3Afiles%20read%3Aanalytics&audience=${encodeURIComponent(audience)}`
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md z-50 shadow-2xl">
      <div className="mb-2 font-bold text-yellow-300">Auth0 Debug Info:</div>
      {Object.entries(debugInfo).map(([key, value]) => (
        <div key={key} className="mb-1">
          <span className="text-blue-300">{key}:</span> 
          <span className="text-white ml-1 break-all">{value}</span>
        </div>
      ))}
      <div className="mt-3 pt-2 border-t border-gray-600">
        <div className="text-red-300 font-bold">Expected in Auth0 Allowed Callback URLs:</div>
        <div className="text-white">{getRedirectUri()}</div>
      </div>
    </div>
  );
};

export default Auth0Debug;
