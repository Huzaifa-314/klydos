#!/bin/bash

# Initial setup script for Google Compute Engine
# Run this script once on your GCE instance to prepare it for deployments

set -e

echo "🚀 Setting up GCE instance for CI/CD deployment..."

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo "❌ Please do not run this script as root"
   exit 1
fi

# Create app directory structure
echo "📁 Creating app directory structure..."
mkdir -p ~/app/api-gateway
cd ~/app

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker installed. Please log out and back in for group changes to take effect."
else
    echo "✅ Docker is already installed"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed"
else
    echo "✅ Docker Compose is already installed"
fi

# Create .env file template
if [ ! -f ~/app/.env ]; then
    echo "📝 Creating .env file template..."
    cat > ~/app/.env << 'EOF'
# Database Configuration
DB_PASSWORD=change_this_secure_password

# Admin API Key
ADMIN_API_KEY=change_this_admin_key

# Stripe Configuration (if using)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# Application Configuration
GIN_MODE=release
EOF
    echo "✅ .env file created at ~/app/.env"
    echo "⚠️  Please update ~/app/.env with your actual values"
else
    echo "✅ .env file already exists"
fi

# Set up firewall rules reminder
echo ""
echo "🔒 Firewall Configuration Reminder:"
echo "   Make sure your GCE firewall allows:"
echo "   - SSH (port 22)"
echo "   - HTTP (port 80)"
echo "   - HTTPS (port 443)"
echo ""

# Display system information
echo "📊 System Information:"
echo "   User: $(whoami)"
echo "   Home: $HOME"
echo "   App Directory: ~/app"
echo "   Docker Version: $(docker --version 2>/dev/null || echo 'Not installed')"
echo "   Docker Compose Version: $(docker-compose --version 2>/dev/null || echo 'Not installed')"
echo ""

# Check if user is in docker group
if groups | grep -q docker; then
    echo "✅ User is in docker group"
else
    echo "⚠️  User is NOT in docker group. Please run:"
    echo "   sudo usermod -aG docker $USER"
    echo "   Then log out and back in"
fi

echo ""
echo "✅ GCE setup completed!"
echo ""
echo "Next steps:"
echo "1. Update ~/app/.env with your actual configuration"
echo "2. Add your SSH public key to ~/.ssh/authorized_keys for GitHub Actions"
echo "3. Configure GitHub secrets (GCE_HOST, GCE_USER, GCE_SSH_PRIVATE_KEY)"
echo "4. Push to main branch to trigger deployment"
echo ""

