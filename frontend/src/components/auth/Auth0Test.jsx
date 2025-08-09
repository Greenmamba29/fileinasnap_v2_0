import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Auth0Test = () => {
  const { loginWithRedirect, isAuthenticated, user, error, isLoading } = useAuth0();

  const handleLogin = () => {
    console.log('Attempting login with redirect...');
    console.log('Current origin:', window.location.origin);
    console.log('Expected redirect URI:', `${window.location.origin}/callback`);
    
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`,
      }
    });
  };

  if (error) {
    console.error('Auth0 Error:', error);
    return (
      <div className="fixed top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
        <strong className="font-bold">Auth0 Error: </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  }

  if (isLoading) {
    return <div className="fixed top-4 left-4 bg-blue-100 px-4 py-2 rounded">Loading Auth0...</div>;
  }

  if (isAuthenticated) {
    return (
      <div className="fixed top-4 left-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded max-w-md">
        <strong className="font-bold">✅ Success! </strong>
        <span className="block sm:inline">Logged in as: {user?.email || user?.name}</span>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
      <button 
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Test Auth0 Login
      </button>
    </div>
  );
};

export default Auth0Test;
