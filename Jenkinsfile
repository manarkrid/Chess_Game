pipeline {
    agent none

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root'  // ← AJOUTE -u root
                }
            }
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Tests unitaires') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root'  // ← AJOUTE -u root
                }
            }
            steps {
                sh 'npx vitest run'  // ← Utilise npx au lieu de npm run
            }
        }

        stage('Tests UI') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host -u root'  // ← AJOUTE -u root
                }
            }
            steps {
                sh 'npx playwright test --reporter=html'  // ← Utilise npx
            }
        }
    }

    post {
        always {
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: 'html',
                reportFiles: 'index.html',
                reportName: 'VitestReport',
                useWrapperFileDirectly: true
            ])

            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'PlaywrightReport',
                useWrapperFileDirectly: true
            ])
        }
    }
}