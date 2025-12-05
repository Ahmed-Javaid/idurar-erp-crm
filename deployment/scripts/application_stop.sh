#!/bin/bash
set -e

echo "Stopping existing containers..."
cd /opt/idurar-app

if [ -f docker-compose.yml ]; then
    docker-compose down || true
fi

echo "Application Stop completed successfully"
