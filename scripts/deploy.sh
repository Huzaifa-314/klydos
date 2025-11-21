#!/bin/bash

# Deployment script for Google Compute Engine
# This script pulls the latest Docker images and restarts services

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Set defaults if not provided
DOCKER_REGISTRY=${DOCKER_REGISTRY:-ghcr.io}
GITHUB_REPOSITORY=${GITHUB_REPOSITORY:-}
IMAGE_TAG=${IMAGE_TAG:-latest}

# Login to GitHub Container Registry (if token provided)
if [ -n "$GITHUB_TOKEN" ]; then
    echo "📦 Logging into GitHub Container Registry..."
    # Extract username from repository (format: username/repo)
    GITHUB_USER=$(echo "$GITHUB_REPOSITORY" | cut -d'/' -f1)
    echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USER" --password-stdin || {
        echo "⚠️  Warning: Could not login to GHCR. Using public images if available."
    }
else
    echo "⚠️  No GITHUB_TOKEN provided. Attempting to pull public images..."
fi

# Navigate to app directory
cd ~/app || { echo "❌ Error: ~/app directory not found"; exit 1; }

# Export environment variables for docker-compose
export DOCKER_REGISTRY
export GITHUB_REPOSITORY
export IMAGE_TAG

# Use production compose file if it exists, otherwise use default
COMPOSE_FILE="docker-compose.prod.yml"
if [ ! -f "$COMPOSE_FILE" ]; then
    COMPOSE_FILE="docker-compose.yml"
    echo "⚠️  Using default docker-compose.yml (docker-compose.prod.yml not found)"
fi

# Pull latest images
echo "📥 Pulling latest Docker images..."
docker-compose -f "$COMPOSE_FILE" pull || {
    echo "⚠️  Warning: Some images failed to pull. Continuing with existing images..."
}

# Stop existing containers gracefully
echo "🛑 Stopping existing containers..."
docker-compose -f "$COMPOSE_FILE" down --timeout 30 || true

# Start services
echo "▶️  Starting services..."
docker-compose -f "$COMPOSE_FILE" up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Health check
echo "🏥 Running health checks..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo "✅ Health check passed!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ Health check attempt $RETRY_COUNT/$MAX_RETRIES..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "⚠️  Warning: Health check failed after $MAX_RETRIES attempts"
    echo "📋 Container status:"
    docker-compose ps
    exit 1
fi

# Clean up old images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

# Show running containers
echo "📊 Current container status:"
docker-compose -f "$COMPOSE_FILE" ps

echo "✅ Deployment completed successfully!"

