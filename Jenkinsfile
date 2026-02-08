pipeline {
  agent none
  stages {
    stage('Build') {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.57.0-noble'
          args '--network=host -u root'  
        }
      }
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }
  }
}