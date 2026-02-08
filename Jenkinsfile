pipeline {
    agent { 
        docker {
            image 'mcr.microsoft.com/playwright:v1.57.0-noble'
            args '--network=host'
        }
    }

    stages {
        stage('Clean Workspace') {
            steps {
                echo 'Nettoyage complet du workspace'
                deleteDir() // Supprime tout, y compris node_modules
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Début étape build'
                sh 'npm install'
                sh 'npm run build'
                echo 'Fin étape build'
            }
        }

        stage('Test unitaire') {
            steps {
                echo 'Test unitaire'
                sh 'npm install -D jsdom @vitest/ui'
                sh 'npm run test'
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
                }
            }
        }

        stage('Test UI') {
            steps {
                echo 'Test UI'
                sh 'npx playwright install'
                sh 'npm run test:e2e'
            }
            post {
                always {
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

        stage('Deploy') {
            when { branch 'master' }
            environment {
                NETLIFY_AUTH_TOKEN = credentials('NETLIFY_TOKEN')
            }
            steps {
                sh 'npm install'
                sh 'npm run build'
                sh 'node_modules/netlify-cli/bin/run.js deploy --prod --site chessnotalreadyexists.netlify.app'
            }
        }
    }
}
