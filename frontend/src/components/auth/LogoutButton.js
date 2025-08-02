import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = ({ className = "", children = "Log Out" }) => {
  const { logout, isLoading } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return (
    <button 
      className={`transition-colors disabled:opacity-50 ${className}`}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default LogoutButton;