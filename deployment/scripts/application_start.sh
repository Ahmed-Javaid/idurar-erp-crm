#!/bin/bash
set -e

echo "Starting application with Docker Compose..."
cd /opt/idurar-app

docker-compose pull
docker-compose up -d

echo "Waiting for services to be healthy..."
sleep 30

echo "Application Start completed successfully"
