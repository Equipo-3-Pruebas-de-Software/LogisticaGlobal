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
        
        // Configuración específica para Selenium
        CHROME_DRIVER_VERSION = '138.0.7204.50'  // Versión compatible con Chrome 138
        CHROME_DRIVER_URL = "https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/${env.CHROME_DRIVER_VERSION}/win64/chromedriver-win64.zip"
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
                        powershell -Command "(Get-Content frontend/.env) -replace 'VITE_API_URL=.*', 'VITE_API_URL=http://localhost:3000' | Set-Content frontend/.env"
                        '''
                    } else if (env.BRANCH_NAME == 'selenium-jenkins-test') {
                        bat '''
                        powershell -Command "(Get-Content frontend/.env) -replace 'VITE_API_URL=.*', 'VITE_API_URL=http://192.168.56.1:3000' | Set-Content frontend/.env"
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
                bat """
                ${DOCKER_COMPOSE_CMD} down --remove-orphans
                ${DOCKER_COMPOSE_CMD} build --no-cache
                ${DOCKER_COMPOSE_CMD} up -d
                """
            }
        }

        stage('Wait for Servers') {
            steps {
                echo 'Waiting for servers to start...'
                sleep 15  // Tiempo aumentado para asegurar inicio
            }
        }

        stage('Verificar Servicios') {
            steps {
                bat "docker ps"
            }
        }

        // ===== STAGE MEJORADO PARA SELENIUM =====
        stage('Setup Selenium Environment') {
            steps {
                script {
                    // Instalar Node.js y verificar versión
                    bat 'npm install -g npm@latest'
                    
                    // Configuración con PowerShell (más robusto que CMD)
                    powershell """
                    # Descargar ChromeDriver
                    Write-Host "🔵 Descargando ChromeDriver v${env.CHROME_DRIVER_VERSION}..."
                    $ProgressPreference = 'SilentlyContinue'
                    Invoke-WebRequest -Uri "${env.CHROME_DRIVER_URL}" -OutFile "chromedriver.zip"
                    
                    if (-not (Test-Path "chromedriver.zip")) {
                        throw "❌ Falló la descarga de ChromeDriver"
                    }
                    
                    # Descomprimir
                    Write-Host "🔵 Descomprimiendo..."
                    Expand-Archive -Path "chromedriver.zip" -DestinationPath "." -Force
                    
                    # Mover ejecutable
                    Move-Item -Path "chromedriver-win64/chromedriver.exe" -Destination "chromedriver.exe" -Force
                    
                    # Limpieza
                    Remove-Item "chromedriver.zip" -Force
                    Remove-Item "chromedriver-win64" -Recurse -Force -ErrorAction SilentlyContinue
                    
                    # Verificar instalación
                    if (Test-Path "chromedriver.exe") {
                        Write-Host "✅ ChromeDriver instalado correctamente"
                        .\\chromedriver.exe --version
                    } else {
                        throw "❌ ChromeDriver no se instaló correctamente"
                    }
                    """
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                dir('selenium') {
                    script {
                        // Instalar dependencias y ejecutar tests con manejo de errores
                        powershell """
                        try {
                            npm install
                            if (-not $?) { throw "❌ Falló npm install" }
                            
                            Write-Host "🔵 Ejecutando auth.js..."
                            node auth.js
                            if (-not $?) { throw "❌ Falló auth.js" }
                            
                            Write-Host "🔵 Ejecutando create-new-incident.js..."
                            node create-new-incident.js
                            if (-not $?) { throw "❌ Falló create-new-incident.js" }
                            
                            Write-Host "✅ Todos los tests pasaron"
                        } catch {
                            Write-Host $_.Exception.Message
                            exit 1
                        }
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            slackSend(channel: '#integracion-jenkins', message: "✅ Build SUCCESS: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (Chrome v138)")
        }
        failure {
            slackSend(channel: '#integracion-jenkins', message: "❌ Build FAILED: ${env.JOB_NAME} - ${env.BUILD_NUMBER} - Consulte los logs")
        }
        always {
            echo 'Pipeline terminado - Limpiando recursos...'
            bat 'docker system prune -f || echo "⚠️ Error en limpieza Docker"'
        }
    }
}