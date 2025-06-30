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
                
                # Verificar integridad del archivo (en bytes)
                $fileSize = (Get-Item $downloadPath).Length
                if ($fileSize -lt 1MB) {
                    throw "❌ Archivo descargado es demasiado pequeño ($([math]::Round($fileSize/1MB, 2)) MB)"
                }
                
                Write-Host "✅ Descarga completada ($([math]::Round($fileSize/1MB, 2)) MB)"
                
                # Descomprimir
                $extractPath = Join-Path -Path $pwd -ChildPath "chromedriver_temp"
                New-Item -ItemType Directory -Path $extractPath -Force | Out-Null
                
                Write-Host "🔵 Descomprimiendo..."
                Expand-Archive -Path $downloadPath -DestinationPath $extractPath -Force
                
                # Buscar el ejecutable
                $chromeDriverExe = Get-ChildItem -Path $extractPath -Filter "chromedriver.exe" -Recurse | Select-Object -First 1
                
                if (-not $chromeDriverExe) {
                    throw "❌ No se encontró chromedriver.exe en el archivo descargado"
                }
                
                # Mover a ubicación final
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