pipeline {
    agent any

    triggers {
        pollSCM('* * * * *')
    }

    environment {
        LANG = 'en_US.UTF-8'
        LC_ALL = 'en_US.UTF-8'
        DOCKER_COMPOSE_CMD = "docker-compose -f docker-compose.yml"
        DOCKERHUB_USER = 'hakdyr24'
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-creds'
    }

    stages {
        stage('Limpiar espacio') {
            steps {
                bat '''
                echo 🧹 Limpiando Docker para liberar espacio...
                docker system prune -af --volumes
                '''
            }
        }

        stage('Configurar entorno') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'jenkins-local' || env.BRANCH_NAME == 'main') {
                        bat '''
                        powershell -Command "(Get-Content frontend/.env) -replace 'VITE_API_URL=.*', 'VITE_API_URL=http://192.168.51.15:3000' | Set-Content frontend/.env"
                        '''
                    } else if (env.BRANCH_NAME == 'jenkins-ec2') {
                        bat '''
                        powershell -Command "(Get-Content frontend/.env) -replace 'VITE_API_URL=.*', 'VITE_API_URL=http://3.139.240.205:3000' | Set-Content frontend/.env"
                        '''
                    }
                }
            }
        }

        stage('Crear .env del backend') {
            steps {
                bat '''
                echo DB_HOST=db > backend\\.env
                echo DB_USER=root >> backend\\.env
                echo DB_PASSWORD=password >> backend\\.env
                echo DB_NAME=incidentesdb >> backend\\.env
                echo DB_PORT=3306 >> backend\\.env
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
                bat "${DOCKER_COMPOSE_CMD} down"
                bat "${DOCKER_COMPOSE_CMD} up -d --build"
            }
        }

        stage('Wait for Servers') {
            steps {
                echo 'Waiting for servers to start...'
                sleep 10 // Ajusta el tiempo si es necesario
            }
        }

        stage('Verificar Servicios') {
            steps {
                bat "docker ps"
            }
        }

        stage('Run Cypress Tests') {
            steps {
                echo 'Running Cypress tests...'
                bat 'npx cypress run --config-file cypress.config.js --headless --browser electron'
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
