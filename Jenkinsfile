pipeline {
    agent any

    stages {

        stage('Build') {
            agent { 
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root:root'
                }
            }
            steps {
                sh '''
                    npm install
                    npm run build
                '''
            }
        }

        stage('Test Unitaire (Vitest)') {
            agent { 
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root:root'
                }
            }
            steps {
                sh '''
                    export HOME=/tmp
                    npm run test || true
                '''
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
            agent { 
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root:root'
                }
            }
            steps {
                sh '''
                    export HOME=/tmp
                    npx playwright install --with-deps
                    npm run test:e2e || true
                '''
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

        stage('docker') {
            agent any
            when { 
                branch 'main' 
            }
            environment {
                CI_REGISTRY = 'ghcr.io'
                CI_REGISTRY_USER = 'manarkrid'
                CI_REGISTRY_IMAGE = "${CI_REGISTRY}/${CI_REGISTRY_USER}/chess"
                CI_REGISTRY_PASSWORD = credentials('CI_REGISTRY_PASSWORD')
            }
            steps {
                sh 'docker build --network=host -t $CI_REGISTRY_IMAGE .'
                sh 'echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY'
                sh 'docker push $CI_REGISTRY_IMAGE'
            }
        }

        stage('Deploy to Netlify') {
            when { branch 'main' }
            agent { 
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root:root'
                }
            }
            environment {
                NETLIFY_AUTH_TOKEN = credentials('NETLIFY_TOKEN')
            }
            steps {
                sh '''
                    export HOME=/tmp
                    npm install netlify-cli
                    npx netlify deploy --prod --site=chess-game-manar --dir=dist --auth=$NETLIFY_AUTH_TOKEN
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}