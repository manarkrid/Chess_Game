pipeline {
    agent none
    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        // 1️⃣ Nettoyage du workspace avant checkout
        stage('Prepare Workspace') {
            agent { label 'jenkins-agent' }
            steps {
                script {
                    // Supprime tout dans le workspace, même les fichiers root
                    sh 'sudo rm -rf * || true'
                }
            }
        }

        // 2️⃣ Checkout du code
        stage('Checkout') {
            agent { label 'jenkins-agent' }
            steps {
                checkout scm
            }
        }

        // 3️⃣ Build avec Docker
        stage('Build') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host' // <-- retire --user root
                }
            }
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        // 4️⃣ Tests unitaires
        stage('Tests unitaires') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host'
                }
            }
            steps {
                sh 'npm run test'
            }
        }

        // 5️⃣ Tests UI
        stage('Tests UI') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '--network=host'
                }
            }
            steps {
                sh 'npm run test:e2e'
            }
        }
    }

    post {
        always {
            script {
                // Publier rapports HTML (optionnel)
                publishHTML([
                    allowMissing: true,
                    reportDir: 'html',
                    reportFiles: 'index.html',
                    reportName: 'VitestReport',
                    useWrapperFileDirectly: true
                ])
                publishHTML([
                    allowMissing: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'PlaywrightReport',
                    useWrapperFileDirectly: true
                ])
            }
        }
    }
}
