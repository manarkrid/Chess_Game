pipeline {
    agent any  

    environment {
        NETLIFY_AUTH_TOKEN = credentials('NETLIFY_TOKEN')
        HOME = '/tmp'
        PLAYWRIGHT_BROWSERS_PATH = '/tmp/playwright-browsers'
    }

    stages {

        stage('Build') {
            agent { 
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root:root'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    export HOME=/tmp
                    npm ci
                    npx --yes playwright install --with-deps chromium
                    npm run build
                '''
            }
        }

        stage('Test Unitaire (Vitest)') {
            agent { 
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root:root'
                    reuseNode true
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
                    reuseNode true
                }
            }
            steps {
                sh '''
                    export HOME=/tmp
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

        stage('Docker Build & Push') {
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
                sh '''
                    docker build -t $CI_REGISTRY_IMAGE .
                    echo $CI_REGISTRY_PASSWORD | docker login $CI_REGISTRY -u $CI_REGISTRY_USER --password-stdin
                    docker push $CI_REGISTRY_IMAGE
                '''
            }
        }

        stage('Deploy to Netlify') {
            when { branch 'main' }
            agent { 
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root:root'
                    reuseNode true
                }
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
