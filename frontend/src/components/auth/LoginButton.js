import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = ({ className = "", children = "Log In" }) => {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: '/dashboard'
      }
    });
  };

  return (
    <button 
      className={`transition-colors disabled:opacity-50 ${className}`}
      onClick={handleLogin}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default LoginButton;