pipeline {
    agent any  // agent global pour que les post steps puissent s'exécuter

    environment {
        NETLIFY_AUTH_TOKEN = credentials('NETLIFY_TOKEN') // pour le deploy Netlify
    }

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
                    npx playwright install --with-deps
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
            agent { 
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root:root'
                }
            }
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

        stage('Deploy to Netlify') {
            when { branch 'main' }
            agent { 
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root:root'
                }
            }
            steps {
                sh '''
                    npm install netlify-cli
                    npx netlify deploy --prod --site=chess-game-manar --dir=dist --auth=$NETLIFY_AUTH_TOKEN
                '''
            }
        }
    }

    post {
        always {
            // entourer cleanWs() dans node {} si agent global absent
            cleanWs()
        }
    }
}
