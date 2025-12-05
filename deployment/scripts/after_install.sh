#!/bin/bash
set -e

echo "Configuring environment variables..."
cd /opt/idurar-app

# Copy environment file
if [ ! -f .env ]; then
    echo "DATABASE=$DATABASE_URI" > .env
    echo "JWT_SECRET=$JWT_SECRET" >> .env
    echo "NODE_ENV=production" >> .env
fi

echo "Setting file permissions..."
chmod +x deployment/scripts/*.sh

echo "After Install completed successfully"
