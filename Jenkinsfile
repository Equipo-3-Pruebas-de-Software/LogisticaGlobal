pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_CMD = "docker-compose -f docker-compose.yml"
        DOCKERHUB_USER = 'hakdyr24'
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-creds' // ID de tus credenciales en Jenkins
    }

    stages {
        stage('Configurar entorno') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'jenkins-local') {
                        sh 'sed -i "s|VITE_API_URL=.*|VITE_API_URL=http://localhost:3000|" frontend/.env'
                    } else if (env.BRANCH_NAME == 'jenkins-ec2' || env.BRANCH_NAME == 'main') {
                        sh 'sed -i "s|VITE_API_URL=.*|VITE_API_URL=http://3.143.5.181:3000|" frontend/.env'
                    }
                }
            }
        }

        stage('Crear .env del backend') {
            steps {
                sh '''
                cat <<EOF > backend/.env
DB_HOST=db
DB_USER=root
DB_PASSWORD=password
DB_NAME=incidentesdb
DB_PORT=3306
EOF
                '''
            }
        }

        stage('Build imágenes y Push a DockerHub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS_ID) {
                        def backendImage = docker.build("${DOCKERHUB_USER}/logisticaglobal:backend", "backend")
                        def frontendImage = docker.build("${DOCKERHUB_USER}/logisticaglobal:frontend", "frontend")

                        backendImage.push()
                        frontendImage.push()
                    }
                }
            }
        }

        stage('Desplegar contenedores') {
            steps {
                sh "${DOCKER_COMPOSE_CMD} down"
                sh "${DOCKER_COMPOSE_CMD} up -d"
            }
        }

        stage('Verificar Servicios') {
            steps {
                sh "docker ps"
            }
        }

        stage('Ejecutar pruebas Cypress') {
            when {
                anyOf {
                    branch 'main'
                    branch 'jenkins-ec2'
                }
            }
            steps {
                sh "${DOCKER_COMPOSE_CMD} run --rm cypress"
            }
        }
    }

    post {
        success {
            slackSend(channel: '#integracion-jenkins', message: "✅ Build SUCCESS: ${env.JOB_NAME} - ${env.BUILD_NUMBER}")
        }
        failure {
            slackSend(channel: '#integracion-jenkins', message: "❌ Build FAILED: ${env.JOB_NAME} - ${env.BUILD_NUMBER}")
        }
        always {
            echo 'Pipeline terminado'
        }
    }
}
