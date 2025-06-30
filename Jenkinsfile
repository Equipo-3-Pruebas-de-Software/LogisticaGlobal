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
                        // Build backend
                        def backendImage = docker.build("${DOCKERHUB_USER}/logisticaglobal:backend", "backend")
                        
                        // Build frontend con reintentos
                        def maxRetries = 3
                        def retryCount = 0
                        def frontendImage = null
                        
                        while(retryCount < maxRetries) {
                            try {
                                frontendImage = docker.build("${DOCKERHUB_USER}/logisticaglobal:frontend", "frontend")
                                break
                            } catch(e) {
                                retryCount++
                                echo "⚠️ Fallo en build frontend (intento $retryCount/$maxRetries): ${e}"
                                if(retryCount >= maxRetries) {
                                    error("❌ Build frontend falló después de $maxRetries intentos")
                                }
                                sleep(time: 30, unit: 'SECONDS')
                            }
                        }
                        
                        // Push con reintentos
                        retryCount = 0
                        while(retryCount < maxRetries) {
                            try {
                                backendImage.push()
                                frontendImage.push()
                                break
                            } catch(e) {
                                retryCount++
                                echo "⚠️ Fallo en push a Docker Hub (intento $retryCount/$maxRetries): ${e}"
                                if(retryCount >= maxRetries) {
                                    error("❌ Push a Docker Hub falló después de $maxRetries intentos")
                                }
                                sleep(time: 60, unit: 'SECONDS')
                            }
                        }
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
                    
                    // Script PowerShell simplificado y corregido
                    powershell '''
                    try {
                        # Configurar TLS
                        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
                        
                        # Descargar ChromeDriver
                        $url = "https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/138.0.7204.50/win64/chromedriver-win64.zip"
                        $output = "$pwd\\chromedriver.zip"
                        
                        Write-Host "Descargando ChromeDriver..."
                        Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
                        
                        if (-not (Test-Path $output)) {
                            throw "No se pudo descargar ChromeDriver"
                        }
                        
                        # Descomprimir
                        $extractPath = "$pwd\\chromedriver_temp"
                        New-Item -ItemType Directory -Path $extractPath -Force | Out-Null
                        Expand-Archive -Path $output -DestinationPath $extractPath -Force
                        
                        # Encontrar y mover el ejecutable
                        $chromeDriverExe = Get-ChildItem -Path $extractPath -Filter "chromedriver.exe" -Recurse | Select-Object -First 1
                        if (-not $chromeDriverExe) {
                            throw "No se encontró chromedriver.exe en el archivo descargado"
                        }
                        
                        Move-Item -Path $chromeDriverExe.FullName -Destination "$pwd\\chromedriver.exe" -Force
                        
                        # Verificar instalación
                        if (-not (Test-Path "$pwd\\chromedriver.exe")) {
                            throw "Instalación fallida: chromedriver.exe no encontrado"
                        }
                        
                        Write-Host "ChromeDriver instalado correctamente"
                        & "$pwd\\chromedriver.exe" --version
                        
                    } catch {
                        Write-Host "ERROR: $_"
                        exit 1
                    } finally {
                        # Limpieza
                        if (Test-Path $output) { Remove-Item $output -Force }
                        if (Test-Path $extractPath) { Remove-Item $extractPath -Recurse -Force }
                    }
                    '''
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                dir('selenium') {
                    script {
                        // Instalar dependencias y ejecutar tests con reporte detallado
                        powershell '''
                        try {
                            # Instalar dependencias
                            Write-Host "🔵 Instalando dependencias NPM..."
                            npm install
                            if (-not $?) { throw "❌ Falló npm install" }
                            
                            # Ejecutar auth.js con captura de output
                            Write-Host "🔵 Ejecutando auth.js..."
                            $authOutput = node auth.js 2>&1 | Out-String
                            Write-Host "=== RESULTADO AUTH TEST ==="
                            Write-Host $authOutput
                            Write-Host "=========================="
                            if (-not $?) { throw "❌ Falló auth.js" }
                            
                            # Ejecutar create-new-incident.js con captura de output
                            Write-Host "🔵 Ejecutando create-new-incident.js..."
                            $incidentOutput = node create-new-incident.js 2>&1 | Out-String
                            Write-Host "=== RESULTADO INCIDENT TEST ==="
                            Write-Host $incidentOutput
                            Write-Host "============================="
                            if (-not $?) { throw "❌ Falló create-new-incident.js" }
                            
                            Write-Host "✅ Todos los tests pasaron exitosamente"
                            
                            # Generar reporte JUnit (opcional)
                            $testResults = @"
                            <testsuite name="Selenium Tests">
                                <testcase name="Authentication Test" classname="AuthTest">
                                    <system-out><![CDATA[$authOutput]]></system-out>
                                </testcase>
                                <testcase name="Incident Creation Test" classname="IncidentTest">
                                    <system-out><![CDATA[$incidentOutput]]></system-out>
                                </testcase>
                            </testsuite>
                            "@
                            
                            $testResults | Out-File -FilePath "selenium-test-results.xml" -Encoding UTF8
                            
                        } catch {
                            Write-Host "❌ Error en los tests: $($_.Exception.Message)"
                            Write-Host "Detalles del error: $($_.ScriptStackTrace)"
                            exit 1
                        }
                        '''
                        
                        // Archivar resultados para Jenkins
                        junit 'selenium/selenium-test-results.xml'
                        
                        // Mostrar resultados en consola
                        bat '''
                        echo RESULTADOS DE LOS TESTS SELENIUM:
                        type selenium-test-results.xml
                        '''
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