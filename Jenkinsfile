pipeline {
    agent any

    triggers {
        pollSCM('* * * * *')
    }

    environment {
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
                    if (env.BRANCH_NAME == 'jenkins-local') {
                        bat '''
                        powershell -Command "(Get-Content frontend/.env) -replace 'VITE_API_URL=.*', 'VITE_API_URL=http://localhost:3000' | Set-Content frontend/.env"
                        '''
                    } else if (env.BRANCH_NAME == 'jenkins-ec2' || env.BRANCH_NAME == 'main') {
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

        stage('Verificar Servicios') {
            steps {
                bat "docker ps"
            }
        }

        stage('Ejecutar pruebas Cypress') {
            // ❗ Esta sección requiere contenedores Linux en Windows o ajustes adicionales
            // Si Docker Desktop está configurado para contenedores Linux, esto puede funcionar.
            steps {
                echo 'Ejecutando pruebas Cypress con Docker...'
                bat 'docker run --rm -v %cd%:/e2e -w /e2e cypress/included:14.4.1 --config-file cypress.config.js --headless --browser electron'
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
