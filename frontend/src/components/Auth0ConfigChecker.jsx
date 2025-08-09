import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Auth0ConfigChecker = () => {
  const { loginWithRedirect, isAuthenticated, user, error, isLoading } = useAuth0();
  const [testResults, setTestResults] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
  const redirectUri = `${window.location.origin}/callback`;

  const checkAuth0Config = async () => {
    setIsChecking(true);
    setTestResults(null);

    try {
      // Test 1: Check if Auth0 domain is reachable
      const domainTest = await fetch(`https://${domain}/.well-known/openid-configuration`);
      const domainResult = {
        test: 'Domain Reachability',
        status: domainTest.ok ? 'PASS' : 'FAIL',
        details: domainTest.ok ? 'Auth0 domain is reachable' : `HTTP ${domainTest.status}: ${domainTest.statusText}`
      };

      // Test 2: Check if client ID format is correct
      const clientIdTest = {
        test: 'Client ID Format',
        status: clientId && clientId.length > 30 ? 'PASS' : 'FAIL',
        details: clientId ? 
          (clientId.length > 30 ? 'Client ID format looks correct' : `Client ID length: ${clientId.length} (should be 32+)`) :
          'Client ID is missing'
      };

      // Test 3: Check Auth0 authorization endpoint
      const authUrl = `https://${domain}/authorize?client_id=${clientId}&response_type=code&scope=openid%20profile%20email&redirect_uri=${encodeURIComponent(redirectUri)}&audience=${encodeURIComponent(audience)}`;
      const authTest = {
        test: 'Authorization URL Test',
        status: 'INFO',
        details: `Auth URL: ${authUrl}`
      };

      setTestResults({
        tests: [domainResult, clientIdTest, authTest],
        config: {
          domain,
          clientId,
          audience,
          redirectUri,
          currentUrl: window.location.href,
          isAuthenticated,
          user: user ? { sub: user.sub, email: user.email } : null,
          error: error ? error.message : null
        }
      });
    } catch (err) {
      setTestResults({
        tests: [{
          test: 'Configuration Check',
          status: 'ERROR',
          details: err.message
        }]
      });
    } finally {
      setIsChecking(false);
    }
  };

  const testDirectLogin = () => {
    const authUrl = `https://${domain}/authorize?client_id=${clientId}&response_type=code&scope=openid%20profile%20email&redirect_uri=${encodeURIComponent(redirectUri)}&audience=${encodeURIComponent(audience)}`;
    window.open(authUrl, '_blank');
  };

  return (
    <div className="fixed top-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="text-lg font-bold mb-3">Auth0 Configuration Checker</h3>
      
      <div className="space-y-2 mb-4">
        <div className="text-sm">
          <strong>Domain:</strong> {domain}
        </div>
        <div className="text-sm">
          <strong>Client ID:</strong> {clientId?.substring(0, 8)}...
        </div>
        <div className="text-sm">
          <strong>Redirect URI:</strong> {redirectUri}
        </div>
        <div className="text-sm">
          <strong>Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
        </div>
        {error && (
          <div className="text-sm text-red-400">
            <strong>Error:</strong> {error.message}
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={checkAuth0Config}
          disabled={isChecking}
          className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium disabled:opacity-50"
        >
          {isChecking ? 'Checking...' : 'Run Config Check'}
        </button>
        
        <button
          onClick={testDirectLogin}
          className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm font-medium"
        >
          Test Direct Login (New Tab)
        </button>
        
        <button
          onClick={() => loginWithRedirect()}
          className="w-full bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm font-medium"
        >
          Auth0 SDK Login
        </button>
      </div>

      {testResults && (
        <div className="mt-4 max-h-64 overflow-y-auto">
          <h4 className="font-bold text-sm mb-2">Test Results:</h4>
          {testResults.tests?.map((test, idx) => (
            <div key={idx} className="text-xs mb-2 p-2 bg-gray-800 rounded">
              <div className="flex items-center gap-2">
                <span className={test.status === 'PASS' ? 'text-green-400' : test.status === 'FAIL' ? 'text-red-400' : 'text-yellow-400'}>
                  {test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : 'ℹ️'}
                </span>
                <strong>{test.test}</strong>
              </div>
              <div className="mt-1 text-gray-300 break-all">{test.details}</div>
            </div>
          ))}
          
          {testResults.config && (
            <div className="text-xs mt-3 p-2 bg-gray-800 rounded">
              <strong>Current Config:</strong>
              <pre className="mt-1 text-gray-300 break-all whitespace-pre-wrap">
                {JSON.stringify(testResults.config, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Auth0ConfigChecker;
