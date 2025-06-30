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
        
        CHROME_DRIVER_VERSION = '138.0.7204.50'
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
                sleep 15
            }
        }

        stage('Verificar Servicios') {
            steps {
                bat "docker ps"
            }
        }

        stage('Setup Selenium Environment') {
            steps {
                script {
                    bat 'npm install -g npm@latest'
                    
                    powershell '''
                    $chromeDriverUrl = "https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/138.0.7204.50/win64/chromedriver-win64.zip"
                    $downloadPath = Join-Path -Path $pwd -ChildPath "chromedriver.zip"
                    
                    Write-Host "🔵 Descargando ChromeDriver desde $chromeDriverUrl"
                    
                    # Configurar política de progreso y seguridad
                    $ProgressPreference = "SilentlyContinue"
                    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
                    
                    try {
                        # Descargar con reintentos
                        $retryCount = 0
                        $maxRetries = 3
                        $success = $false
                        
                        do {
                            try {
                                Invoke-WebRequest -Uri $chromeDriverUrl -OutFile $downloadPath -UseBasicParsing
                                if (Test-Path $downloadPath -PathType Leaf) {
                                    $success = $true
                                }
                            } catch {
                                $retryCount++
                                if ($retryCount -ge $maxRetries) {
                                    throw
                                }
                                Start-Sleep -Seconds 5
                            }
                        } while (-not $success -and $retryCount -lt $maxRetries)
                        
                        if (-not (Test-Path $downloadPath)) {
                            throw "❌ No se pudo descargar ChromeDriver después de $maxRetries intentos"
                        }
                        
                        # Verificar integridad del archivo
                        if ((Get-Item $downloadPath).Length -lt 1MB) {
                            throw "❌ Archivo descargado es demasiado pequeño (posible descarga fallida)"
                        }
                        
                        Write-Host "✅ Descarga completada ($([math]::Round((Get-Item $downloadPath).Length/1MB, 2)) MB)"
                        
                        # Descomprimir
                        $extractPath = Join-Path -Path $pwd -ChildPath "chromedriver_temp"
                        New-Item -ItemType Directory -Path $extractPath -Force | Out-Null
                        
                        Write-Host "🔵 Descomprimiendo..."
                        Expand-Archive -Path $downloadPath -DestinationPath $extractPath -Force
                        
                        # Buscar el ejecutable en la estructura de directorios
                        $chromeDriverExe = Get-ChildItem -Path $extractPath -Filter "chromedriver.exe" -Recurse | Select-Object -First 1
                        
                        if (-not $chromeDriverExe) {
                            throw "❌ No se encontró chromedriver.exe en el archivo descargado"
                        }
                        
                        # Mover a ubicación final (usando Join-Path para compatibilidad)
                        $destinationPath = Join-Path -Path $pwd -ChildPath "chromedriver.exe"
                        Move-Item -Path $chromeDriverExe.FullName -Destination $destinationPath -Force
                        Write-Host "✅ ChromeDriver instalado en $destinationPath"
                        
                    } catch {
                        Write-Host "❌ Error grave: $_"
                        Write-Host "Detalles del error: $($_.Exception.Message)"
                        exit 1
                    } finally {
                        # Limpieza
                        if (Test-Path $downloadPath) { Remove-Item $downloadPath -Force }
                        if (Test-Path $extractPath) { Remove-Item $extractPath -Recurse -Force }
                    }
                    
                    # Verificación final
                    $finalPath = Join-Path -Path $pwd -ChildPath "chromedriver.exe"
                    if (-not (Test-Path $finalPath)) {
                        throw "❌ Instalación fallida: chromedriver.exe no encontrado"
                    }
                    
                    Write-Host "🔵 Versión instalada:"
                    & $finalPath --version
                    '''
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                dir('selenium') {
                    script {
                        powershell '''
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
                        '''
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