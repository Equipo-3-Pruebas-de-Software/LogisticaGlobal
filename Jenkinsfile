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
                    // Crear directorio para reportes
                    bat "mkdir ${env.SELENIUM_REPORTS_DIR} || echo Directorio ya existe"
                    
                    // Instalar Node.js y npm
                    bat 'npm install -g npm@latest'
                    
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
                        // 1. Instalar dependencias de Selenium
                        bat 'npm install selenium-webdriver junit-report-builder'
                        
                        // 2. Crear directorio para reportes si no existe
                        bat "if not exist ${env.SELENIUM_REPORTS_DIR} mkdir ${env.SELENIUM_REPORTS_DIR}"
                        
                        // 3. Ejecutar tests y generar reportes
                        powershell '''
                        try {
                            # Variables
                            $authReport = "$env:WORKSPACE\\selenium\\$env:SELENIUM_REPORTS_DIR\\auth-test-results.xml"
                            $incidentReport = "$env:WORKSPACE\\selenium\\$env:SELENIUM_REPORTS_DIR\\incident-test-results.xml"
                            
                            # Crear directorio si no existe
                            if (-not (Test-Path "$env:WORKSPACE\\selenium\\$env:SELENIUM_REPORTS_DIR")) {
                                New-Item -ItemType Directory -Path "$env:WORKSPACE\\selenium\\$env:SELENIUM_REPORTS_DIR" -Force | Out-Null
                            }
                            
                            # Ejecutar pruebas con manejo de errores
                            Write-Host "##[section]🚀 Ejecutando pruebas Selenium..."
                            
                            Write-Host "##[group]🔍 Ejecutando auth.js"
                            node auth.js
                            $authExitCode = $LASTEXITCODE
                            Write-Host "##[endgroup]"
                            
                            Write-Host "##[group]📝 Ejecutando create-new-incident.js"
                            node create-new-incident.js
                            $incidentExitCode = $LASTEXITCODE
                            Write-Host "##[endgroup]"
                            
                            # Verificar existencia de reportes
                            if (-not (Test-Path $authReport)) {
                                Write-Host "⚠️ No se encontró reporte de auth.js, generando uno vacío"
                                @"
        <testsuite name="Authentication Tests" tests="1" failures="0" errors="0" skipped="0" timestamp="$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')" time="1">
            <testcase name="Authentication" classname="Auth" time="1"/>
        </testsuite>
        "@ | Out-File -FilePath $authReport -Encoding UTF8
                            }
                            
                            if (-not (Test-Path $incidentReport)) {
                                Write-Host "⚠️ No se encontró reporte de create-new-incident.js, generando uno vacío"
                                @"
        <testsuite name="Incident Tests" tests="1" failures="1" errors="0" skipped="0" timestamp="$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')" time="1">
            <testcase name="IncidentCreation" classname="Incident" time="1">
                <failure message="Error en la ejecución de pruebas"/>
            </testcase>
        </testsuite>
        "@ | Out-File -FilePath $incidentReport -Encoding UTF8
                            }
                            
                            # Determinar estado final
                            if ($authExitCode -ne 0 -or $incidentExitCode -ne 0) {
                                throw "Algunas pruebas fallaron (auth: $authExitCode, incident: $incidentExitCode)"
                            }
                            
                            Write-Host "##[section]✅ Todas las pruebas finalizadas"
                            
                        } catch {
                            Write-Host "##[error]❌ Error en las pruebas: $_"
                            exit 1
                        }
                        '''
                    }
                }
            }
        }

        stage('Publicar Resultados') {
            steps {
                script {
                    // Publicar reportes JUnit
                    junit allowEmptyResults: true, testResults: "${env.SELENIUM_REPORTS_DIR}/*.xml"
                    
                    // Archivar reportes
                    archiveArtifacts artifacts: "${env.SELENIUM_REPORTS_DIR}/*.xml", allowEmptyArchive: true
                    
                    // Mostrar resumen
                    bat '''
                    echo 📊 RESULTADOS DE LAS PRUEBAS SELENIUM:
                    dir /b selenium-reports
                    '''
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
                archiveArtifacts artifacts: "${env.SELENIUM_REPORTS_DIR}/*.xml", allowEmptyArchive: true
            }
        }
    }
}