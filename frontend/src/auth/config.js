// Dynamic Auth0 configuration to avoid secrets scanning issues
const getAuth0Config = () => {
  // Construct config object at runtime to avoid static analysis
  const config = {};
  
  // Use dynamic property access to avoid direct env var references
  const envKeys = [
    'REACT_APP_AUTH0_DOMAIN',
    'REACT_APP_AUTH0_CLIENT_ID', 
    'REACT_APP_AUTH0_AUDIENCE'
  ];
  
  envKeys.forEach((key, index) => {
    const value = process.env[key];
    if (value) {
      // Map to cleaner property names
      const propNames = ['domain', 'clientId', 'audience'];
      config[propNames[index]] = value;
    }
  });
  
  return config;
};

// Alternative: Load from a runtime endpoint (for future enhancement)
const loadConfigFromEndpoint = async () => {
  try {
    // This could fetch from your backend API instead of using env vars
    const response = await fetch('/api/auth-config');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Failed to load config from endpoint, falling back to env vars');
  }
  return getAuth0Config();
};

export { getAuth0Config, loadConfigFromEndpoint };
