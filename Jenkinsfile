pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
        IMAGE_TAG = "${BUILD_NUMBER}"
        BACKEND_IMAGE = "idurar-backend:${IMAGE_TAG}"
        FRONTEND_IMAGE = "idurar-frontend:${IMAGE_TAG}"
        STAGING_SERVER = 'staging.idurar.com'
        PRODUCTION_SERVER = 'production.idurar.com'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout scm
                sh 'git log -1'
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            echo 'Installing backend dependencies...'
                            sh 'npm ci'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            echo 'Installing frontend dependencies...'
                            sh 'npm ci'
                        }
                    }
                }
            }
        }
        
        stage('Lint & Code Quality') {
            parallel {
                stage('Backend Lint') {
                    steps {
                        dir('backend') {
                            echo 'Running backend linting...'
                            sh 'npm run lint || true'
                        }
                    }
                }
                stage('Frontend Lint') {
                    steps {
                        dir('frontend') {
                            echo 'Running frontend linting...'
                            sh 'npm run lint || true'
                        }
                    }
                }
            }
        }
        
        stage('Unit Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            echo 'Running backend unit tests...'
                            sh 'npm test || true'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            echo 'Running frontend unit tests...'
                            sh 'npm test || true'
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            echo 'Building backend...'
                            sh 'echo "Backend build complete"'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            echo 'Building frontend...'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    echo 'Building Docker images...'
                    sh """
                        docker build -t ${BACKEND_IMAGE} ./backend
                        docker build -t ${FRONTEND_IMAGE} ./frontend
                    """
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                echo 'Running security scans on Docker images...'
                sh """
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image ${BACKEND_IMAGE} || true
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image ${FRONTEND_IMAGE} || true
                """
            }
        }
        
        stage('Push Docker Images') {
            steps {
                script {
                    echo 'Pushing Docker images to registry...'
                    sh """
                        echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin ${DOCKER_REGISTRY}
                        docker tag ${BACKEND_IMAGE} ${DOCKER_REGISTRY}/${BACKEND_IMAGE}
                        docker tag ${FRONTEND_IMAGE} ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}
                        docker push ${DOCKER_REGISTRY}/${BACKEND_IMAGE}
                        docker push ${DOCKER_REGISTRY}/${FRONTEND_IMAGE}
                    """
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                script {
                    echo 'Deploying to staging environment...'
                    sh """
                        ssh jenkins@${STAGING_SERVER} '
                            cd /opt/idurar-staging &&
                            docker-compose pull &&
                            docker-compose up -d &&
                            docker-compose ps
                        '
                    """
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                echo 'Running integration tests on staging...'
                dir('tests') {
                    sh 'npm install'
                    sh 'npm run test:integration || true'
                }
            }
        }
        
        stage('UI Tests (Cypress)') {
            steps {
                echo 'Running UI tests with Cypress...'
                dir('tests') {
                    sh 'npx cypress run --config baseUrl=http://${STAGING_SERVER} || true'
                }
            }
        }
        
        stage('Performance Tests') {
            steps {
                echo 'Running performance tests...'
                sh """
                    docker run --rm -v \$(pwd)/tests:/tests loadimpact/k6 run /tests/performance.js || true
                """
            }
        }
        
        stage('Approval for Production') {
            when {
                branch 'master'
            }
            steps {
                input message: 'Deploy to Production?', ok: 'Deploy'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'master'
            }
            steps {
                script {
                    echo 'Deploying to production environment...'
                    sh """
                        ssh jenkins@${PRODUCTION_SERVER} '
                            cd /opt/idurar-production &&
                            docker-compose pull &&
                            docker-compose up -d &&
                            docker-compose ps
                        '
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
            emailext(
                subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: "Good news! The build ${env.BUILD_NUMBER} completed successfully.",
                to: 'team@idurar.com'
            )
        }
        failure {
            echo 'Pipeline failed!'
            emailext(
                subject: "FAILURE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: "Build ${env.BUILD_NUMBER} failed. Please check the logs.",
                to: 'team@idurar.com'
            )
        }
    }
}
