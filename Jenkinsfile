pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.57.0-noble'
            args '-u root:root'
        }
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm ci
                    npx playwright install --with-deps
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test Unitaire (Vitest)') {
            steps {
                sh 'npm run test || true'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'html',
                        reportFiles: 'index.html',
                        reportName: 'Vitest Report',
                        reportTitles: 'Vitest Test Report'
                    ])
                }
            }
        }

        stage('Test UI (Playwright)') {
            steps {
                sh 'npm run test:e2e || true'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Report',
                        reportTitles: 'Playwright Test Report'
                    ])
                }
            }
        }

        stage('Deploy') {
            when { 
                branch 'main' 
            }
            steps {
                echo 'Déploiement sur la branche main'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}