// Test Auth0 Configuration
const domain = 'fileinasnap.us.auth0.com';
const clientId = 'uz1AwsSLMSexpuH4MaWVOX5wNrUrecwO';
const audience = 'https://api.fileinasnap.com';

console.log('Auth0 Configuration Test');
console.log('========================');
console.log('Domain:', domain);
console.log('Client ID:', clientId);
console.log('Audience:', audience);

// Test Auth0 well-known endpoint
const wellKnownUrl = `https://${domain}/.well-known/openid_configuration`;
console.log('\nTesting Auth0 well-known endpoint...');
console.log('URL:', wellKnownUrl);

// Test client configuration endpoint
const clientUrl = `https://${domain}/.well-known/jwks.json`;
console.log('JWKS URL:', clientUrl);

console.log('\nRequired Callback URLs for your Auth0 application:');
console.log('- https://fileinasnap.com/callback');
console.log('- https://fileinasnap-frontend.netlify.app/callback');
console.log('- http://localhost:3000/callback');

console.log('\nRequired Logout URLs:');
console.log('- https://fileinasnap.com');
console.log('- https://fileinasnap-frontend.netlify.app');
console.log('- http://localhost:3000');

console.log('\nRequired Web Origins:');
console.log('- https://fileinasnap.com');
console.log('- https://fileinasnap-frontend.netlify.app');
console.log('- http://localhost:3000');
