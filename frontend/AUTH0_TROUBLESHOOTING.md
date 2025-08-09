# Auth0 Integration Troubleshooting Guide

## Current Issue
Your Auth0 integration with Netlify is showing "failed to create or update configuration" error.

## Current Configuration
- **Domain**: fileinasnap.us.auth0.com
- **Client ID**: uz1AwsSLMSexpuH4MaWVOX5wNrUrecwO
- **Audience**: https://api.fileinasnap.com

## Troubleshooting Steps

### 1. Verify Auth0 Domain
The Auth0 domain endpoint is returning "Not found", which suggests:
- Domain might be incorrect
- Auth0 tenant might not be active
- Network connectivity issue

**Action Required**: Check your Auth0 dashboard at https://manage.auth0.com and verify:
- Your Auth0 tenant domain
- Your application exists and is active

### 2. Configure Auth0 Application Settings

In your Auth0 Dashboard, navigate to Applications → Your App → Settings:

#### Allowed Callback URLs (Required):
```
https://fileinasnap.com/callback,
https://fileinasnap-frontend.netlify.app/callback,
http://localhost:3000/callback
```

#### Allowed Logout URLs:
```
https://fileinasnap.com,
https://fileinasnap-frontend.netlify.app,
http://localhost:3000
```

#### Allowed Web Origins:
```
https://fileinasnap.com,
https://fileinasnap-frontend.netlify.app,
http://localhost:3000
```

#### Application Type:
Should be set to "Single Page Application"

### 3. Enable Required Grants
In Advanced Settings → Grant Types, ensure these are enabled:
- Authorization Code
- Refresh Token
- Implicit

### 4. API Configuration
If you have an API configured, ensure:
- API Identifier matches your audience: `https://api.fileinasnap.com`
- API is enabled for your application

### 5. Test Configuration
After making changes in Auth0:

1. **Test the well-known endpoint**:
   ```bash
   curl "https://YOUR_CORRECT_DOMAIN/.well-known/openid_configuration"
   ```

2. **Test your live site**:
   - Visit https://fileinasnap.com
   - Click "Sign In"
   - Should redirect to Auth0 login page

3. **Check browser console** for any Auth0-related errors

### 6. Alternative Domains to Check
Your Auth0 domain might be one of these formats:
- `fileinasnap.us.auth0.com`
- `fileinasnap.auth0.com`
- `fileinasnap-dev.us.auth0.com`
- Custom domain if configured

### 7. Netlify Integration Steps
Once Auth0 is properly configured:

1. In Netlify dashboard → Site Settings → Identity & Git Gateway
2. Enable Identity if using Netlify Identity
3. Or configure external provider pointing to your Auth0 endpoints

### 8. Environment Variables Verification
Current Netlify environment variables are set correctly:
- ✅ REACT_APP_AUTH0_DOMAIN
- ✅ REACT_APP_AUTH0_CLIENT_ID  
- ✅ REACT_APP_AUTH0_AUDIENCE

## Next Steps
1. **Verify Auth0 domain** in your Auth0 dashboard
2. **Update callback URLs** as shown above
3. **Test the configuration** using the live site
4. **Report back** with any specific error messages from browser console

## Testing Commands
After fixing Auth0 configuration:

```bash
# Test auth debug page
curl "https://fileinasnap.com/auth-debug"

# Test main page
curl "https://fileinasnap.com" | grep "Auth0"

# Check Auth0 well-known endpoint
curl "https://YOUR_CORRECT_DOMAIN/.well-known/openid_configuration"
```
