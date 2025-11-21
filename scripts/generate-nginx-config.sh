#!/bin/bash

# Script to generate nginx.conf from template
# Usage: ./generate-nginx-config.sh [environment] [domain] [allowed-origins]

set -e

ENVIRONMENT=${1:-development}
DOMAIN=${2:-localhost}
ALLOWED_ORIGINS=${3:-*}

TEMPLATE_FILE="Backend/api-gateway/nginx.conf.template"
OUTPUT_FILE="Backend/api-gateway/nginx.conf"

if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "❌ Template file not found: $TEMPLATE_FILE"
    exit 1
fi

echo "🔧 Generating nginx.conf for environment: $ENVIRONMENT"
echo "   Domain: $DOMAIN"
echo "   Allowed Origins: $ALLOWED_ORIGINS"

# Replace placeholders in template
sed -e "s|\${SERVER_NAME}|$DOMAIN|g" \
    -e "s|\${ALLOWED_ORIGINS}|$ALLOWED_ORIGINS|g" \
    "$TEMPLATE_FILE" > "$OUTPUT_FILE"

echo "✅ Generated nginx.conf at $OUTPUT_FILE"

