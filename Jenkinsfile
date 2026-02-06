pipeline {
    agent none

    stages {
        // Étape 1 : Build du   projet
        stage('Build') {
            agent { docker { image 'mcr.microsoft.com/playwright:v1.57.0-noble' } }
            steps {
                echo " Installation des dépendances et build du projet"
                sh 'npm install'
                sh 'npm run build'
            }
        }

        // Étape 2 : Tests unitaires
        stage('Tests Unitaires') {
            agent { docker { image 'mcr.microsoft.com/playwright:v1.57.0-noble' } }
            steps {
                echo " Lancement des tests unitaires Vitest"
                sh 'npx vitest --reporter=html run'
            }
        }

        // Étape 3 : Tests UI / E2E
        stage('Tests UI') {
            agent { docker { image 'mcr.microsoft.com/playwright:v1.57.0-noble' } }
            steps {
                echo " Lancement des tests UI Playwright"
                sh 'npx playwright install'
                sh 'npx playwright test --reporter=html'
            }
        }
    }

    post {
        always {
            echo " Publication des rapports HTML dans Jenkins"

            // Rapport Vitest
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: false,
                reportDir: 'html',
                reportFiles: 'index.html',
                reportName: 'VitestReport'
            ])

            // Rapport Playwright
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: false,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'PlaywrightReport'
            ])
        }
    }
}
