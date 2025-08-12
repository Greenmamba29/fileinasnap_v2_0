#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   NETLIFY_AUTH_TOKEN=xxxx NETLIFY_SITE_ID=yyyy ./scripts/netlify-apply-config.sh
# Optional flags:
#   BASE_DIR (default: frontend)
#   PUBLISH_DIR (default: build)
#   BUILD_CMD (default: "npm ci --legacy-peer-deps && npm run build")
#   NODE_VERSION (default: 20)
#   NPM_FLAGS (default: --legacy-peer-deps)

BASE_DIR=${BASE_DIR:-frontend}
PUBLISH_DIR=${PUBLISH_DIR:-build}
BUILD_CMD=${BUILD_CMD:-"npm ci --legacy-peer-deps && npm run build"}
NODE_VERSION=${NODE_VERSION:-20}
NPM_FLAGS=${NPM_FLAGS:---legacy-peer-deps}

if [[ -z "${NETLIFY_AUTH_TOKEN:-}" || -z "${NETLIFY_SITE_ID:-}" ]]; then
  echo "Missing NETLIFY_AUTH_TOKEN or NETLIFY_SITE_ID env vars" >&2
  exit 1
fi

# Update site build settings (quote cmd properly)
cat <<JSON | curl -sS -X PATCH \
  -H "Authorization: Bearer ${NETLIFY_AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  --data-binary @- \
  "https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}" >/dev/null
{
  "build_settings": {
    "base": "${BASE_DIR}",
    "dir": "${PUBLISH_DIR}",
    "cmd": "${BUILD_CMD}"
  },
  "env": {
    "NODE_VERSION": "${NODE_VERSION}",
    "NETLIFY_USE_YARN": "false",
    "NPM_FLAGS": "${NPM_FLAGS}"
  }
}
JSON

echo "Updated Netlify site settings. Triggering build..."

# Trigger a new build
curl -sS -X POST \
  -H "Authorization: Bearer ${NETLIFY_AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  "https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/builds" >/dev/null

echo "Build triggered. Monitor progress in Netlify Deploys dashboard."