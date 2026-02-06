pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.57.0-noble'
      args '--network=host'
    }
  }

  stages {

    stage('Install & Build') {
      steps {
        echo "Installation des dépendances"
        sh 'npm install'
        echo "Build du projet"
        sh 'npm run build'
      }
    }

    stage('Tests Unitaires') {
      steps {
        echo "Lancement des tests unitaires (Vitest)"
        sh 'npx vitest run --reporter=html'
      }
    }

    stage('Tests UI / E2E') {
      steps {
        echo "Lancement des tests UI (Playwright)"
        sh 'npx playwright test --reporter=html'
      }
    }
  }

  post {
    always {
      echo "Publication des rapports HTML"

      publishHTML([
        allowMissing: true,
        keepAll: true,
        reportDir: 'html',
        reportFiles: 'index.html',
        reportName: 'VitestReport'
      ])

      publishHTML([
        allowMissing: true,
        keepAll: true,
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'PlaywrightReport'
      ])
    }
  }
}
