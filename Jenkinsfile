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
        SELENIUM_REPORTS_DIR = 'selenium-reports'
    }

    stages {
        stage('Limpiar espacio') {
            steps {
                bat '''
                echo 🧹 Limpiando Docker para liberar espacio...
                docker system prune -af --volumes || echo "⚠️ Advertencia en limpieza Docker"
                '''
            }
        }

        stage('Configurar entorno') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'jenkins-local' || env.BRANCH_NAME == 'main') {
                        bat '''
                        powershell -Command "(Get-Content frontend/.env) -replace 'VITE_API_URL=.*', 'VITE_API_URL=http://localhost:3000' | Set-Content frontend/.env" || exit 0
                        '''
                    } else if (env.BRANCH_NAME == 'selenium-jenkins-test') {
                        bat '''
                        powershell -Command "(Get-Content frontend/.env) -replace 'VITE_API_URL=.*', 'VITE_API_URL=http://192.168.56.1:3000' | Set-Content frontend/.env" || exit 0
                        '''
                    }
                }
            }
        }

        stage('Crear .env del backend') {
            steps {
                bat '''
                echo DB_HOST=db > backend\\.env || exit 0
                echo DB_USER=root >> backend\\.env || exit 0
                echo DB_PASSWORD=password >> backend\\.env || exit 0
                echo DB_NAME=incidentesdb >> backend\\.env || exit 0
                echo DB_PORT=3306 >> backend\\.env || exit 0
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
                ${DOCKER_COMPOSE_CMD} down --remove-orphans || echo "⚠️ No se pudieron detener contenedores existentes"
                ${DOCKER_COMPOSE_CMD} build --no-cache || exit 1
                ${DOCKER_COMPOSE_CMD} up -d || exit 1
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
                bat "docker ps || echo '⚠️ Error al verificar contenedores'"
            }
        }

        stage('Setup Selenium Environment') {
            steps {
                script {
                    // Crear directorio para reportes (manera más robusta)
                    powershell '''
                    if (-not (Test-Path "$env:SELENIUM_REPORTS_DIR")) {
                        New-Item -ItemType Directory -Path "$env:SELENIUM_REPORTS_DIR" -Force | Out-Null
                    }
                    '''
                    
                    // Instalar Node.js y npm
                    bat 'npm install -g npm@latest || echo "⚠️ Error al actualizar npm"'
                    
                    // Configurar ChromeDriver
                    powershell '''
                    try {
                        # Configurar TLS
                        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
                        
                        # Descargar ChromeDriver
                        $url = $env:CHROME_DRIVER_URL
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
                    bat 'npm install selenium-webdriver junit-report-builder chrome || exit 0'
                    
                    powershell '''
                    try {
                    # Configurar la codificación de salida
                    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
                    $OutputEncoding = [System.Text.Encoding]::UTF8
                    
                    $reportsPath = "$env:WORKSPACE\\selenium\\$env:SELENIUM_REPORTS_DIR"
                    if (-not (Test-Path $reportsPath)) {
                        New-Item -ItemType Directory -Path $reportsPath -Force | Out-Null
                    }
                    
                    Write-Host "======================================"
                    Write-Host "INICIANDO EJECUCION DE PRUEBAS SELENIUM"
                    Write-Host "======================================"
                    
                    # Variables para códigos de salida
                    $authExitCode = 0
                    $incidentExitCode = 0
                    
                    # Ejecutar pruebas de autenticación
                    Write-Host "EJECUTANDO PRUEBAS DE AUTENTICACION"
                    try {
                        node auth.js
                        $authExitCode = $LASTEXITCODE
                    } catch {
                        $authExitCode = 1
                        Write-Host "ERROR EN PRUEBAS DE AUTENTICACION: $_"
                    }
                    
                    # Ejecutar pruebas de incidentes
                    Write-Host "EJECUTANDO PRUEBAS DE INCIDENTES"
                    try {
                        node create-new-incident.js
                        $incidentExitCode = $LASTEXITCODE
                    } catch {
                        $incidentExitCode = 1
                        Write-Host "ERROR EN PRUEBAS DE INCIDENTES: $_"
                    }
                    
                    # Mover reportes
                    if (Test-Path "auth-test-results.xml") {
                        Move-Item -Path "auth-test-results.xml" -Destination "$reportsPath\\auth-test-results.xml" -Force
                    }
                    if (Test-Path "incident-test-results.xml") {
                        Move-Item -Path "incident-test-results.xml" -Destination "$reportsPath\\incident-test-results.xml" -Force
                    }
                    
                    # Mostrar resumen
                    Write-Host "RESUMEN DE PRUEBAS:"
                    Write-Host "Autenticacion: $($authExitCode -eq 0 ? 'EXITO' : 'FALLO')"
                    Write-Host "Incidentes: $($incidentExitCode -eq 0 ? 'EXITO' : 'FALLO')"
                    
                    # Resultado final
                    if ($authExitCode -ne 0 -or $incidentExitCode -ne 0) {
                        throw "ALGUNAS PRUEBAS FALLARON (Autenticacion: $authExitCode, Incidentes: $incidentExitCode)"
                    }
                    
                    Write-Host "TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE"
                    
                    } catch {
                    Write-Host "ERROR EN LAS PRUEBAS: $_"
                    exit 1
                    }
                    '''
                }
            }
        }
    }
}
    }

    post {
        success {
            slackSend(channel: '#integracion-jenkins', 
                     message: "✅ Build SUCCESS: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (Chrome v${env.CHROME_DRIVER_VERSION})")
        }
        failure {
            slackSend(channel: '#integracion-jenkins', 
                     message: "❌ Build FAILED: ${env.JOB_NAME} - ${env.BUILD_NUMBER} - Consulte los logs: ${env.BUILD_URL}")
        }
        always {
            echo 'Pipeline terminado - Limpiando recursos...'
            bat 'docker system prune -f || echo "⚠️ Error en limpieza Docker"'
            
            // Guardar reportes incluso si falla
            script {
                archiveArtifacts artifacts: "selenium/${env.SELENIUM_REPORTS_DIR}/*.xml", allowEmptyArchive: true
            }
        }
    }
}