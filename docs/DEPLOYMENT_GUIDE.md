# IDURAR ERP CRM - CI/CD Implementation Guide

## Project Overview

This document provides comprehensive instructions for implementing a complete CI/CD pipeline for the IDURAR ERP CRM application as part of the Software Quality Engineering course project.

**Application:** IDURAR ERP CRM (Open Source)
**Repository:** https://github.com/idurar/idurar-erp-crm
**Tech Stack:** MERN (MongoDB, Express.js, React, Node.js)

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Stage 1: Source Stage](#stage-1-source-stage)
4. [Stage 2: Build Stage](#stage-2-build-stage)
5. [Stage 3: Test Stage](#stage-3-test-stage)
6. [Stage 4: Staging Deployment](#stage-4-staging-deployment)
7. [Stage 5: Production Deployment](#stage-5-production-deployment)
8. [Running Tests Locally](#running-tests-locally)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)
10. [Troubleshooting](#troubleshooting)

---

## Project Structure

```
idurar-erp-crm/
├── backend/                    # Node.js backend application
│   ├── Dockerfile             # Backend container definition
│   ├── package.json           # Backend dependencies
│   ├── src/                   # Source code
│   └── tests/                 # Backend unit tests
│       └── api.test.js        # API test cases
├── frontend/                   # React frontend application
│   ├── Dockerfile             # Frontend container definition
│   ├── nginx.conf             # Nginx configuration
│   ├── package.json           # Frontend dependencies
│   └── src/                   # Source code
├── tests/                      # E2E and integration tests
│   ├── cypress/               # Cypress UI tests
│   │   ├── e2e/
│   │   │   └── ui-tests.cy.js
│   │   └── support/
│   │       ├── commands.js
│   │       └── e2e.js
│   ├── performance/           # Performance tests
│   │   ├── load-test.js       # k6 load testing
│   │   └── stress-test.js     # k6 stress testing
│   ├── cypress.config.js      # Cypress configuration
│   └── package.json           # Test dependencies
├── deployment/                 # Deployment configurations
│   ├── kubernetes.yaml        # Kubernetes manifests
│   ├── buildspec.yml          # AWS CodeBuild spec
│   ├── appspec.yml            # AWS CodeDeploy spec
│   └── scripts/               # Deployment scripts
├── .github/                    # GitHub Actions workflows
│   └── workflows/
│       └── cicd-pipeline.yml  # Main CI/CD pipeline
├── docs/                       # Documentation
│   └── TEST_PLAN.md           # Comprehensive test plan
├── Jenkinsfile                # Jenkins pipeline definition
├── docker-compose.yml         # Docker Compose configuration
└── .env.example               # Environment variables template
```

---

## Prerequisites

### Software Requirements

- **Node.js:** v20.9.0 or higher
- **npm:** v10.2.4 or higher
- **Docker:** v20.10 or higher
- **Docker Compose:** v2.20 or higher
- **Git:** Latest version

### Cloud Services (Optional for Deployment)

- **MongoDB Atlas:** For database hosting
- **AWS Account:** For CodeDeploy/CodeBuild
- **Docker Hub Account:** For image registry
- **GitHub Account:** For source control and Actions

---

## Stage 1: Source Stage

### 1.1 Clone Repository

```powershell
# Clone the repository
git clone https://github.com/idurar/idurar-erp-crm.git
cd idurar-erp-crm
```

### 1.2 Configure Environment Variables

#### Backend Configuration

```powershell
# Navigate to backend directory
cd backend

# Copy environment template
Copy-Item .env.example .env

# Edit .env file with your values
notepad .env
```

**Required Environment Variables:**
```env
DATABASE=mongodb+srv://username:password@cluster.mongodb.net/idurar-erp-crm
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=production
PUBLIC_SERVER_FILE=http://localhost:8888/
```

#### Frontend Configuration

```powershell
cd ../frontend
notepad .env
```

**Required Environment Variables:**
```env
VITE_FILE_BASE_URL=http://localhost:8888/
VITE_BACKEND_SERVER=http://localhost:8888/
PROD=false
```

### 1.3 GitHub Webhook Configuration

#### For GitHub Actions

GitHub Actions automatically triggers on push/PR events. No additional configuration needed.

#### For Jenkins

1. Go to your Jenkins instance
2. Configure GitHub webhook:
   - Payload URL: `http://your-jenkins-url/github-webhook/`
   - Content type: `application/json`
   - Events: Push, Pull Request

---

## Stage 2: Build Stage

### 2.1 Local Build

#### Backend Build

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm ci

# Run linting
npm run lint

# Build (if applicable)
# Node.js apps typically don't require compilation
```

#### Frontend Build

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm ci

# Run linting
npm run lint

# Build production bundle
npm run build

# Output will be in dist/ directory
```

### 2.2 Docker Build

#### Build Backend Image

```powershell
# From project root
docker build -t idurar-backend:latest -f backend/Dockerfile ./backend
```

#### Build Frontend Image

```powershell
docker build -t idurar-frontend:latest -f frontend/Dockerfile ./frontend
```

#### Build Both with Docker Compose

```powershell
# Build all services
docker-compose build

# Build and start services
docker-compose up --build -d
```

### 2.3 Verify Build Artifacts

```powershell
# List Docker images
docker images | Select-String "idurar"

# Check running containers
docker-compose ps
```

---

## Stage 3: Test Stage

### 3.1 Backend Unit Tests

```powershell
cd backend/tests

# Install test dependencies
npm install

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- api.test.js
```

**Expected Output:**
```
PASS tests/api.test.js
  Authentication API Tests
    ✓ should login with valid credentials (250ms)
    ✓ should fail login with invalid credentials (100ms)
    ...
  
Test Suites: 1 passed, 1 total
Tests:       25 passed, 25 total
Coverage:    82.5% statements
```

### 3.2 Frontend Unit Tests

```powershell
cd frontend

# Run unit tests
npm test

# Run with coverage
npm test -- --coverage
```

### 3.3 E2E Tests with Cypress

```powershell
cd tests

# Install Cypress and dependencies
npm install

# Run Cypress tests (headless)
npm test

# Run Cypress in interactive mode
npm run test:open

# Run specific browser
npm run test:chrome
npm run test:firefox
```

**Test Coverage:**
- Authentication flows
- Customer CRUD operations
- Invoice management
- Quote management
- Payment recording
- Dashboard functionality
- Responsive design
- Accessibility

### 3.4 Performance Tests with k6

```powershell
cd tests/performance

# Install k6 (Windows)
choco install k6

# Or download from https://k6.io/docs/get-started/installation/

# Run load test
k6 run load-test.js

# Run stress test
k6 run stress-test.js

# Run with custom parameters
k6 run --vus 100 --duration 10m load-test.js
```

**Performance Metrics:**
- Average response time
- 95th percentile response time
- Requests per second
- Error rate
- CPU and memory usage

### 3.5 Security Scanning

```powershell
# Install Trivy
choco install trivy

# Scan backend image
trivy image idurar-backend:latest

# Scan frontend image
trivy image idurar-frontend:latest

# Scan with severity filter
trivy image --severity HIGH,CRITICAL idurar-backend:latest
```

---

## Stage 4: Staging Deployment

### 4.1 Deploy to Local Staging (Docker Compose)

```powershell
# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Check service health
docker-compose ps

# Access application
# Backend: http://localhost:8888
# Frontend: http://localhost:80
```

### 4.2 Deploy to AWS EC2 (Manual)

```powershell
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone https://github.com/idurar/idurar-erp-crm.git
cd idurar-erp-crm

# Configure environment
cp .env.example .env
nano .env

# Deploy
docker-compose up -d
```

### 4.3 Deploy to Kubernetes

```powershell
# Apply Kubernetes manifests
kubectl apply -f deployment/kubernetes.yaml

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services

# View logs
kubectl logs -f deployment/idurar-backend

# Access application (if LoadBalancer)
kubectl get service idurar-frontend-service
```

### 4.4 Deploy with AWS CodeDeploy

```powershell
# Create CodeDeploy application
aws deploy create-application --application-name idurar-app

# Create deployment group
aws deploy create-deployment-group \
  --application-name idurar-app \
  --deployment-group-name staging \
  --service-role-arn arn:aws:iam::account:role/CodeDeployRole \
  --ec2-tag-filters Key=Environment,Value=staging,Type=KEY_AND_VALUE

# Create deployment
aws deploy create-deployment \
  --application-name idurar-app \
  --deployment-group-name staging \
  --github-location repository=your-repo,commitId=your-commit
```

---

## Stage 5: Production Deployment

### 5.1 Pre-Production Checklist

- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance benchmarks met
- [ ] Database backup created
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Monitoring configured
- [ ] Rollback plan prepared

### 5.2 Deploy to Production

#### Using GitHub Actions

```powershell
# Push to master branch triggers automatic deployment
git checkout master
git merge develop
git push origin master

# Monitor deployment in GitHub Actions tab
```

#### Using Jenkins

```powershell
# Trigger Jenkins job
# Approve production deployment when prompted
```

#### Manual Deployment

```powershell
# SSH to production server
ssh production-server

# Pull latest code
cd /opt/idurar-production
git pull origin master

# Build and deploy
docker-compose pull
docker-compose up -d

# Verify deployment
curl http://localhost/api/health
```

### 5.3 Post-Deployment Verification

```powershell
# Health check
curl https://app.idurar.com/api/health

# Smoke tests
curl -X POST https://app.idurar.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"admin123"}'

# Monitor logs
docker-compose logs -f --tail=100
```

---

## Running Tests Locally

### Complete Test Suite

```powershell
# Create test script
New-Item -Path run-all-tests.ps1 -ItemType File

# Add content to script
@"
Write-Host "Running Backend Tests..." -ForegroundColor Green
Set-Location backend/tests
npm install
npm test

Write-Host "`nRunning Frontend Tests..." -ForegroundColor Green
Set-Location ../../frontend
npm test

Write-Host "`nRunning Cypress E2E Tests..." -ForegroundColor Green
Set-Location ../tests
npm install
npm test

Write-Host "`nRunning Performance Tests..." -ForegroundColor Green
k6 run performance/load-test.js

Write-Host "`nAll tests completed!" -ForegroundColor Green
"@ | Set-Content run-all-tests.ps1

# Run test suite
.\run-all-tests.ps1
```

---

## Monitoring and Maintenance

### 10.1 Application Monitoring

#### Setup New Relic

```powershell
# Install New Relic agent for Node.js
npm install newrelic --save

# Add to application entry point
# require('newrelic');
```

#### Setup Sentry for Error Tracking

```powershell
npm install @sentry/node

# Configure in application
# Sentry.init({ dsn: 'your-dsn' });
```

### 10.2 Log Management

```powershell
# View backend logs
docker-compose logs -f backend

# View frontend logs
docker-compose logs -f frontend

# Export logs
docker-compose logs > app-logs.txt
```

### 10.3 Database Backup

```powershell
# Backup MongoDB
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/idurar" --out=./backup

# Restore MongoDB
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/idurar" ./backup
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```powershell
# Find process using port 8888
netstat -ano | findstr :8888

# Kill process
taskkill /PID <process-id> /F
```

#### 2. Docker Build Fails

```powershell
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### 3. Tests Failing

```powershell
# Check test environment
node --version
npm --version

# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

#### 4. Database Connection Issues

```powershell
# Test MongoDB connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/"

# Check network connectivity
Test-NetConnection cluster.mongodb.net -Port 27017
```

---

## Quick Reference Commands

### Development

```powershell
# Start development servers
cd backend; npm run dev    # Terminal 1
cd frontend; npm run dev   # Terminal 2
```

### Testing

```powershell
npm test                   # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage
```

### Docker

```powershell
docker-compose up          # Start services
docker-compose down        # Stop services
docker-compose logs -f     # View logs
docker-compose ps          # List services
```

### Deployment

```powershell
git push origin master     # Trigger CI/CD
kubectl apply -f k8s/      # Deploy to K8s
aws deploy create-deployment  # AWS CodeDeploy
```

---

## Additional Resources

- **Test Plan:** `docs/TEST_PLAN.md`
- **API Documentation:** `docs/API.md`
- **Contributing Guide:** `CONTRIBUTING.md`
- **Security Policy:** `SECURITY.md`

---

## Support and Contact

For issues and questions:
- GitHub Issues: https://github.com/idurar/idurar-erp-crm/issues
- Documentation: https://www.idurarapp.com/docs

---

**Document Version:** 1.0
**Last Updated:** December 5, 2025
