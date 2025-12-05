#!/bin/bash
set -e

echo "Validating backend service..."
backend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/api/health)

if [ "$backend_health" != "200" ]; then
    echo "Backend health check failed with status: $backend_health"
    exit 1
fi

echo "Validating frontend service..."
frontend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)

if [ "$frontend_health" != "200" ]; then
    echo "Frontend health check failed with status: $frontend_health"
    exit 1
fi

echo "Service validation completed successfully"
exit 0
