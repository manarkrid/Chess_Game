pipeline {
    agent any

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh '''
                  npm install
                  npm run build
                '''
            }
        }

        stage('Test unitaire (Vitest)') {
            steps {
                sh '''
                  npm run test
                '''
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        keepAll: true,
                        reportDir: 'html',
                        reportFiles: 'index.html',
                        reportName: 'VitestReport'
                    ])
                }
            }
        }

        stage('Test UI (Playwright)') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    reuseNode true
                }
            }
            steps {
                sh '''
                  npm ci
                  npx playwright install --with-deps
                  npm run test:e2e
                '''
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'PlaywrightReport'
                    ])
                }
            }
        }

        stage('Deploy') {
            when { branch 'main' }
            steps {
                echo 'Deploy ici'
            }
        }
    }
}
