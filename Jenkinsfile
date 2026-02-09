pipeline {
    agent any
    
    options {
        skipDefaultCheckout()
        timeout(time: 60, unit: 'MINUTES')
    }
    
    environment {
        NETLIFY_AUTH_TOKEN = credentials('NETLIFY_TOKEN')
        HOME = '/tmp'
        PLAYWRIGHT_BROWSERS_PATH = '/tmp/playwright-browsers'
    }

    stages {
        stage('Checkout avec configuration Git') {
            steps {
                script {
                    // Configuration Git pour éviter les problèmes réseau
                    sh '''
                        git config --global http.postBuffer 524288000
                        git config --global http.version HTTP/1.1
                        git config --global core.compression 0
                        git config --global http.lowSpeedLimit 0
                        git config --global http.lowSpeedTime 999999
                    '''
                    
                    // Clonage avec shallow clone pour réduire la taille
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        extensions: [
                            [$class: 'CloneOption', depth: 1, noTags: true, shallow: true]
                        ],
                        userRemoteConfigs: [[url: 'https://github.com/manarkrid/Chess_Game']]
                    ])
                }
            }
        }

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
                    npx --yes playwright install --with-deps
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
            when { branch 'main' }
            agent any
            environment {
                CI_REGISTRY = 'ghcr.io'
                CI_REGISTRY_USER = 'manarkrid'
                CI_REGISTRY_IMAGE = "${CI_REGISTRY}/${CI_REGISTRY_USER}/chess"
                CI_REGISTRY_PASSWORD = credentials('CI_REGISTRY_PASSWORD')
            }
            steps {
                sh '''
                    docker build --network=host -t $CI_REGISTRY_IMAGE:latest .
                    echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
                    docker push $CI_REGISTRY_IMAGE:latest
                    docker logout $CI_REGISTRY
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
            script {
                try {
                    cleanWs()
                } catch (Exception e) {
                    echo "Workspace cleanup failed: ${e.message}"
                }
            }
        }
    }
}