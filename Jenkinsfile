pipeline {
    agent none
    
    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        stage('Build') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--user root --network=host'
                }
            }
            steps {
                deleteDir()  // ← AJOUTE CETTE LIGNE
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Tests unitaires') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--user root --network=host'
                }
            }
            steps {
                sh 'npm run test'
            }
        }

        stage('Tests UI') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--user root --network=host'
                }
            }
            steps {
                sh 'npm run test:e2e'
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