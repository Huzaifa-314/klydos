#!/bin/bash

# Script to set up domain configuration on GCE
# This script should be run on the GCE instance after domain is configured

set -e

if [ -z "$1" ]; then
    echo "Usage: ./setup-domain.sh <your-domain.com> [allowed-origins]"
    echo "Example: ./setup-domain.sh api.yourdomain.com https://yourdomain.com,https://www.yourdomain.com"
    exit 1
fi

DOMAIN=$1
ALLOWED_ORIGINS=${2:-"https://$DOMAIN"}

echo "🌐 Setting up domain configuration..."
echo "   Domain: $DOMAIN"
echo "   Allowed Origins: $ALLOWED_ORIGINS"

# Navigate to app directory
cd ~/app || { echo "❌ Error: ~/app directory not found"; exit 1; }

# Check if template exists
if [ ! -f "api-gateway/nginx.conf.template" ]; then
    echo "⚠️  Template not found. Using default configuration."
    # Create nginx.conf with domain
    cat > api-gateway/nginx.conf << EOF
upstream user-service {
    server user-service:8080;
}

server {
    listen 80;
    server_name $DOMAIN;

    client_max_body_size 5M;

    # CORS headers
    add_header 'Access-Control-Allow-Origin' '$ALLOWED_ORIGINS' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-API-Key' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;

    if (\$request_method = 'OPTIONS') {
        return 204;
    }

    access_log /var/log/nginx/api-gateway-access.log;
    error_log /var/log/nginx/api-gateway-error.log;

    location /api/users {
        rewrite ^/api/users/(.*) /users/\$1 break;
        proxy_pass http://user-service;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /health {
        access_log off;
        return 200 "API Gateway is healthy\n";
        add_header Content-Type text/plain;
    }

    location / {
        return 404 '{"error": "Route not found"}';
        add_header Content-Type application/json;
    }
}
EOF
else
    # Generate from template
    sed -e "s|\${SERVER_NAME}|$DOMAIN|g" \
        -e "s|\${ALLOWED_ORIGINS}|$ALLOWED_ORIGINS|g" \
        api-gateway/nginx.conf.template > api-gateway/nginx.conf
fi

echo "✅ Nginx configuration updated"

# Restart API Gateway
echo "🔄 Restarting API Gateway..."
docker-compose -f docker-compose.prod.yml restart api-gateway || docker-compose restart api-gateway

echo "✅ Domain configuration complete!"
echo ""
echo "Next steps:"
echo "1. Verify DNS A record points to this server's IP"
echo "2. Test: curl http://$DOMAIN/health"
echo "3. Set up SSL: sudo certbot --nginx -d $DOMAIN"

