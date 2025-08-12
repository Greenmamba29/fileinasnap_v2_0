#!/bin/bash
set -e

# Check required environment variables
if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
    echo "Error: NETLIFY_AUTH_TOKEN is required"
    exit 1
fi

if [ -z "$NETLIFY_SITE_ID" ]; then
    echo "Error: NETLIFY_SITE_ID is required"
    exit 1
fi

# Set defaults
BASE_DIR=${BASE_DIR:-"frontend"}
PUBLISH_DIR=${PUBLISH_DIR:-"build"}
BUILD_CMD=${BUILD_CMD:-"npm ci --legacy-peer-deps && npm run build"}
NODE_VERSION=${NODE_VERSION:-"20"}
NPM_FLAGS=${NPM_FLAGS:-"--legacy-peer-deps"}

echo "🚀 Applying Netlify configuration..."
echo "Site ID: $NETLIFY_SITE_ID"
echo "Base Dir: $BASE_DIR"
echo "Publish Dir: $PUBLISH_DIR"
echo "Build Command: $BUILD_CMD"

# Use Netlify API to update site configuration
curl -X PATCH \
  -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"build_settings\": {
      \"base\": \"$BASE_DIR\",
      \"dir\": \"$PUBLISH_DIR\",
      \"cmd\": \"$BUILD_CMD\"
    }
  }" \
  "https://api.netlify.com/api/v1/sites/$NETLIFY_SITE_ID"

echo -e "\n🔧 Setting environment variables..."

# Set environment variables
curl -X PUT \
  -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"NODE_VERSION\": \"$NODE_VERSION\"}" \
  "https://api.netlify.com/api/v1/accounts/{account_id}/env/NODE_VERSION?site_id=$NETLIFY_SITE_ID"

curl -X PUT \
  -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"NETLIFY_USE_YARN\": \"false\"}" \
  "https://api.netlify.com/api/v1/accounts/{account_id}/env/NETLIFY_USE_YARN?site_id=$NETLIFY_SITE_ID"

curl -X PUT \
  -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"NPM_FLAGS\": \"$NPM_FLAGS\"}" \
  "https://api.netlify.com/api/v1/accounts/{account_id}/env/NPM_FLAGS?site_id=$NETLIFY_SITE_ID"

echo -e "\n🏗️ Triggering new build..."

# Trigger a new build
curl -X POST \
  -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  "https://api.netlify.com/api/v1/sites/$NETLIFY_SITE_ID/builds"

echo -e "\n✅ Configuration applied and build triggered!"
echo "Check your Netlify dashboard for build progress."
