# Netlify Deployment Configuration

This document contains the complete setup for deploying FileInASnap to Netlify with all checks passing.

## 🔑 Required Information

### What you need
- **Netlify Personal Access Token**: Get from Netlify UI → User settings → Applications → Personal access tokens
- **Netlify Site ID**: `5227ed44-e0cc-40cc-819f-aa26654f5ee3` (Site settings → Site details → API ID)

## 🚀 One‑liner to Apply Config and Trigger Deploy

Replace `YOUR_TOKEN` with your actual Netlify Personal Access Token and run from repo root:

```bash
NETLIFY_AUTH_TOKEN=YOUR_TOKEN \
NETLIFY_SITE_ID=5227ed44-e0cc-40cc-819f-aa26654f5ee3 \
BASE_DIR=frontend \
PUBLISH_DIR=build \
BUILD_CMD="npm ci --legacy-peer-deps && npm run build" \
NODE_VERSION=20 \
NPM_FLAGS="--legacy-peer-deps" \
./scripts/netlify-apply-config.sh
```

## 📁 Files Already Set Up

### Root Configuration
- **`netlify.toml`** (root): 
  - Base: `frontend`
  - Publish: `build`
  - SPA redirect
  - Security headers
  - Node 20
  - Legacy peer deps support

### Frontend Configuration  
- **`frontend/public/_headers`**: Security headers for production
- **`frontend/public/_redirects`**: SPA routing (`/* /index.html 200`)

### Automation Script
- **`scripts/netlify-apply-config.sh`**: Executable script to apply configuration via API

If needed, make script executable:
```bash
chmod +x ./scripts/netlify-apply-config.sh
```

## 🛠️ Alternative: Netlify CLI Method

If you prefer using the Netlify CLI:

```bash
# Install and setup
npm i -g netlify-cli
netlify login
netlify link           # link repo to site

# Set environment variables
netlify env:set NODE_VERSION 20
netlify env:set NPM_FLAGS "--legacy-peer-deps"
netlify env:set NETLIFY_USE_YARN false

# Deploy
netlify deploy --build --context=deploy-preview
```

## ✅ Verify the Checks

### Watch Deploy Status
1. Go to Netlify → Site → Deploys 
2. Deploy Preview should show all green checks

### Verify Headers
```bash
curl -sI https://fileinasnap.com | grep -E "Strict-Transport|X-Content|X-Frame|Referrer-Policy|Permissions-Policy|X-XSS"
```

Expected output should include:
- `strict-transport-security: max-age=31536000`
- `x-content-type-options: nosniff`
- `x-frame-options: DENY`
- `referrer-policy: strict-origin-when-cross-origin`
- `permissions-policy: camera=(), microphone=(), geolocation=()`
- `x-xss-protection: 1; mode=block`

### Verify SPA Redirects
```bash
curl -sI https://fileinasnap.com/random/path | head
```

Should return `HTTP/2 200` (not 404).

## 🔧 Manual Netlify UI Configuration (If Needed)

If the script fails, manually configure in Netlify UI → Site settings → Build & deploy:

- **Base directory**: `frontend`
- **Publish directory**: `build`  
- **Build command**: `npm ci --legacy-peer-deps && npm run build`

Environment variables:
- `NODE_VERSION`: `20`
- `NPM_FLAGS`: `--legacy-peer-deps`
- `NETLIFY_USE_YARN`: `false`

## 🎯 Current Site Information

- **Site Name**: fileinasnap-frontend
- **Site ID**: `5227ed44-e0cc-40cc-819f-aa26654f5ee3`
- **Custom Domain**: https://fileinasnap.com
- **Netlify URL**: https://fileinasnap-frontend.netlify.app
- **Admin URL**: https://app.netlify.com/projects/fileinasnap-frontend

## 🐛 Troubleshooting

### If Deploy Checks Still Fail

1. **Header rules failure**: Ensure `_headers` file is in `frontend/public/`
2. **Redirect rules failure**: Ensure `_redirects` file is in `frontend/public/` 
3. **Pages changed failure**: Check base/publish directory configuration
4. **Deploy failure**: Verify Node version and npm flags

### Common Issues

- **Build failures**: Usually resolved by `--legacy-peer-deps` flag
- **Path issues**: Ensure `base=frontend` and `publish=build`
- **Missing headers**: `_headers` file must be copied to build output
- **SPA routing**: `_redirects` file must contain `/* /index.html 200`

### Re-trigger Deploy
Push a small commit or rerun from the Netlify UI Checks tab to test fixes.

---

📝 **Note**: This configuration has been tested and verified to pass all Netlify deploy checks including header rules, redirect rules, and pages changed validations.
