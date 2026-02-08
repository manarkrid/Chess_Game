pipeline {
    agent none

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout') {
            agent any
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('Build') {
            agent { docker { image 'mcr.microsoft.com/playwright:v1.57.0-noble' } }
            steps {
                sh 'npm install'
                sh 'chmod +x node_modules/.bin/vue-tsc || true'
                sh 'npm run build'
            }
        }

        stage('Tests Unitaires') {
            agent { docker { image 'mcr.microsoft.com/playwright:v1.57.0-noble' } }
            steps {
                sh 'npx vitest run'
            }
        }

        stage('Tests UI') {
            agent { docker { image 'mcr.microsoft.com/playwright:v1.57.0-noble' } }
            steps {
                sh 'npx playwright install'
                sh 'npx playwright test'
            }
        }
    }
}
