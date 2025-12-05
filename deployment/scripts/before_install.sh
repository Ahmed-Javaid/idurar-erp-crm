#!/bin/bash
set -e

echo "Installing Docker if not present..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
fi

echo "Installing Docker Compose if not present..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo "Creating application directory..."
mkdir -p /opt/idurar-app
cd /opt/idurar-app

echo "Before Install completed successfully"
