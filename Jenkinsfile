pipeline {
    agent{ 
        docker{
            image 'mcr.microsoft.com/playwright:v1.57.0-noble'
            args '--network=host'
        }
    }
    stages {
        stage('build') {
            steps {
                sh 'echo debut etape build'
                sh 'npm install'
                sh 'npm run build'
                sh 'echo fin etape build'
            }
        }
        stage('test unitaire'){
            steps{
                sh 'echo test unitaire'
                sh 'npm install -D jsdom'
                sh 'npm install -D @vitest/ui'
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
                        reportTitles: '',
                        useWrapperFileDirectly: true
                    ])
                }
            }
        }
        stage('test UI'){
            steps{
                    sh 'echo test UI'
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
                        reportTitles: '',
                        useWrapperFileDirectly: true
                    ])
                }
            }
        }
        stage('deploy') {
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
