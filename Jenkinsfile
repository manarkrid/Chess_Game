pipeline {
  agent any
  
  stages {
    stage('Build') {
      steps {
        script {
          sh '''
            docker run --rm \
              -u root \
              --network=host \
              -w /workspace \
              -v ${WORKSPACE}:/workspace \
              mcr.microsoft.com/playwright:v1.57.0-noble \
              bash -c "npm install && npm run build"
          '''
        }
      }
    }
  }
}
