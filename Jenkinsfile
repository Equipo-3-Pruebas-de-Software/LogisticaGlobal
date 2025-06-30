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
                        // 1. Instalar dependencias
                        bat 'npm install'
                        
                        // 2. Ejecutar tests y generar reportes
                        powershell '''
                        # Configurar variables
                        $ErrorActionPreference = "Stop"
                        $testResultsPath = "test-results.xml"
                        
                        try {
                            Write-Host "##[section]Ejecutando tests Selenium..."
                            
                            # Ejecutar auth.js
                            Write-Host "##[group]Ejecutando auth.js"
                            node auth.js
                            if ($LASTEXITCODE -ne 0) { throw "auth.js falló con código $LASTEXITCODE" }
                            Write-Host "##[endgroup]"
                            
                            # Ejecutar create-new-incident.js
                            Write-Host "##[group]Ejecutando create-new-incident.js"
                            node create-new-incident.js
                            if ($LASTEXITCODE -ne 0) { throw "create-new-incident.js falló con código $LASTEXITCODE" }
                            Write-Host "##[endgroup]"
                            
                            # Generar reporte mínimo (si los tests no generan uno)
                            if (-not (Test-Path $testResultsPath)) {
                                @"
                                <testsuite name="Selenium Tests">
                                    <testcase name="auth.js" classname="Authentication"/>
                                    <testcase name="create-new-incident.js" classname="IncidentCreation"/>
                                </testsuite>
        "@ | Out-File -FilePath $testResultsPath -Encoding UTF8
                            }
                            
                            Write-Host "##[section]✅ Todos los tests pasaron exitosamente"
                            
                        } catch {
                            Write-Host "##[error]❌ Error en los tests: $_"
                            
                            # Generar reporte de fallo si no existe
                            if (-not (Test-Path $testResultsPath)) {
                                @"
                                <testsuite name="Selenium Tests">
                                    <testcase name="auth.js" classname="Authentication">
                                        <failure message="Error durante la ejecución"/>
                                    </testcase>
                                    <testcase name="create-new-incident.js" classname="IncidentCreation">
                                        <failure message="Error durante la ejecución"/>
                                    </testcase>
                                </testsuite>
        "@ | Out-File -FilePath $testResultsPath -Encoding UTF8
                            }
                            
                            exit 1
                        }
                        '''
                        
                        // 3. Archivar resultados
                        junit 'selenium/test-results.xml'
                        
                        // 4. Mostrar resumen
                        bat '''
                        echo RESULTADOS DE LOS TESTS SELENIUM:
                        if exist selenium\\test-results.xml type selenium\\test-results.xml
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