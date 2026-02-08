pipeline {
  agent none

  environment {
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1'
    CI = 'true'
  }

  stages {
    stage('Build') {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.57.0-noble'
          args '--network=host'
        }
      }
      steps {
        sh 'npm install --no-audit --no-fund'
        sh 'npm run build'
      }
    }
  }
}
