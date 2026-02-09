pipeline {
    agent any

    environment {
        HOME = '/tmp'
    }

    stages {
        stage('Configure Git') {
            steps {
                sh '''
                    git config --global http.postBuffer 524288000
                    git config --global http.version HTTP/1.1
                    git config --global http.lowSpeedLimit 0
                    git config --global http.lowSpeedTime 999999
                '''
            }
        }

        stage('Install & Build') {
            agent { 
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root:root'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    npm ci
                    npx --yes playwright install --with-deps
                    npm run build
                '''
            }
        }

        stage('Unit Tests (Vitest)') {
            agent { 
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root:root'
                    reuseNode true
                }
            }
            steps {
                sh '''
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

        stage('UI Tests (Playwright)') {
            agent { 
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root:root'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    # Démarrer Vite en arrière-plan
                    npm run dev > /tmp/vite.log 2>&1 &
                    VITE_PID=$!

                    # Attendre que le serveur soit prêt
                    echo " Waiting for Vite server..."
                    for i in {1..60}; do
                        if curl -s http://localhost:5173 > /dev/null 2>&1; then
                            echo " Server ready!"
                            break
                        fi
                        sleep 1
                    done

                    # Lancer les tests
                    npm run test:e2e || true

                    # Arrêter Vite
                    kill $VITE_PID || true
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
            environment {
                NETLIFY_AUTH_TOKEN = credentials('NETLIFY_TOKEN')
            }
            steps {
                sh '''
                    npm install -g netlify-cli
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
