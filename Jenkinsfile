pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_CMD = "docker-compose -f docker-compose.yml"
    }

    stages {
        stage('Clonar código') {
            steps {
                git branch: "${env.BRANCH_NAME}", url: 'https://github.com/Equipo-3-Pruebas-de-Software/LogisticaGlobal.git'
            }
        }

        stage('Configurar entorno') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'jenkins-local') {
                        sh 'sed -i "s|VITE_API_URL=.*|VITE_API_URL=http://localhost:3000|" frontend/.env'
                    } else if (env.BRANCH_NAME == 'jenkins-ec2') {
                        sh 'sed -i "s|VITE_API_URL=.*|VITE_API_URL=http://18.225.35.240:3000|" frontend/.env'
                    }
                }
            }
        }

        stage('Build Docker') {
            steps {
                sh "${DOCKER_COMPOSE_CMD} down"
                sh "${DOCKER_COMPOSE_CMD} up --build -d"
            }
        }

        stage('Verificar Servicios') {
            steps {
                sh "docker ps"
            }
        }
    }

    post {
        always {
            echo 'Pipeline terminado'
        }
    }
}
