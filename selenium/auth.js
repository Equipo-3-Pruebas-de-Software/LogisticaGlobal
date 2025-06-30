const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const reportBuilder = require('junit-report-builder');

// --- Usuarios ---
const usuarios = [
  {
    nombre: "Lucas Castro",
    rut: "11111111-1",
    clave: "clave123",
    rutaHome: "/jefe_turno",
    textoHome: "Crear Incidente"
  },
  {
    nombre: "Margarita Rodriguez",
    rut: "12345677-9",
    clave: "clave123",
    rutaHome: "/supervisor",
    textoHome: "Margarita Rodriguez"
  },
  {
    nombre: "Juan Perez",
    rut: "14856536-8",
    clave: "clave123",
    rutaHome: "/tecnico",
    textoHome: "Robots Asignados"
  }
];

const BASE_URL = "http://localhost:5173";

// --- Función login mejorada ---
async function login(driver, rut, clave) {
  try {
    console.log(`🔑 Intentando login para RUT: ${rut}`);
    await driver.get(BASE_URL);
    await driver.wait(until.elementLocated(By.id('rut')), 15000);
    await driver.findElement(By.id('rut')).clear();
    await driver.findElement(By.id('rut')).sendKeys(rut);
    await driver.findElement(By.id('password')).clear();
    await driver.findElement(By.id('password')).sendKeys(clave);
    await driver.findElement(By.css('button[type="submit"]')).click();
    console.log('✅ Credenciales ingresadas, enviando formulario...');
  } catch (error) {
    console.error('❌ Error en función login:', error);
    throw error;
  }
}

// --- Función cerrarSesion mejorada ---
async function cerrarSesion(driver) {
  try {
    console.log('🔒 Intentando cerrar sesión...');
    
    const cerrarBtn = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Cerrar sesión') or contains(@aria-label, 'Cerrar sesión')]")),
      10000
    );
    
    await driver.executeScript("arguments[0].scrollIntoView(true);", cerrarBtn);
    await driver.executeScript("arguments[0].click();", cerrarBtn);
    
    await driver.wait(async () => {
      const currentUrl = await driver.getCurrentUrl();
      return currentUrl === BASE_URL + '/' || 
             currentUrl === BASE_URL + '/login' ||
             currentUrl === BASE_URL + '/auth';
    }, 15000);
    
    console.log('✅ Sesión cerrada correctamente');
  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error);
    
    try {
      const screenshot = await driver.takeScreenshot();
      const fileName = `error-logout-${Date.now()}.png`;
      require('fs').writeFileSync(fileName, screenshot, 'base64');
      console.log(`📸 Captura de pantalla guardada: ${fileName}`);
    } catch (screenshotError) {
      console.error('Error al tomar captura:', screenshotError);
    }
    
    throw error;
  }
}

// --- Test: credenciales incorrectas mejorado ---
async function testCredencialesIncorrectas(usuario) {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options()
      .addArguments('--no-sandbox')
      .addArguments('--disable-dev-shm-usage')
      .addArguments('--window-size=1920,1080')
    )
    .build();
    
  try {
    console.log(`\n🔍 Iniciando prueba: Credenciales incorrectas para ${usuario.nombre}`);
    
    await login(driver, '11111112-1', 'clave123');
    
    const errorMsg = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Credenciales inválidas')]")),
      10000
    );
    await driver.wait(until.elementIsVisible(errorMsg), 2000);
    
    const errorText = await errorMsg.getText();
    console.log(`✅ [${usuario.nombre}] Mensaje de error encontrado: "${errorText}"`);
    
    return true;
  } catch (e) {
    console.error(`❌ [${usuario.nombre}] test credenciales incorrectas falló:`, e.message);
    
    try {
      const screenshot = await driver.takeScreenshot();
      const fileName = `error-credenciales-${usuario.nombre.replace(/\s+/g, '-')}-${Date.now()}.png`;
      require('fs').writeFileSync(fileName, screenshot, 'base64');
      console.log(`📸 Captura de pantalla guardada: ${fileName}`);
    } catch (screenshotError) {
      console.error('Error al tomar captura:', screenshotError);
    }
    
    throw e;
  } finally {
    await driver.quit();
  }
}

// --- Test: login + logout mejorado ---
async function testLoginLogout(usuario) {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options()
      .addArguments('--no-sandbox')
      .addArguments('--disable-dev-shm-usage')
      .addArguments('--window-size=1920,1080')
    )
    .build();
    
  try {
    console.log(`\n🔍 Iniciando prueba: Login y Logout para ${usuario.nombre}`);
    
    await login(driver, usuario.rut, usuario.clave);

    // Esperar ruta específica
    await driver.wait(until.urlContains(usuario.rutaHome), 10000);
    console.log(`✅ Redirección correcta a: ${usuario.rutaHome}`);

    // Esperar texto visible en home
    let textoHome;
    if (usuario.nombre === "Margarita Rodriguez") {
      textoHome = await driver.wait(
        until.elementLocated(By.xpath(`//h1[contains(@class, 'dashboard-welcome') and contains(., '${usuario.nombre}')]`)),
        10000
      );
    } else {
      textoHome = await driver.wait(
        until.elementLocated(By.xpath(`//*[contains(text(),"${usuario.textoHome}")]`)),
        10000
      );
    }
    await driver.wait(until.elementIsVisible(textoHome), 2000);
    
    const homeText = await textoHome.getText();
    console.log(`✅ Texto en home encontrado: "${homeText}"`);

    // Cerrar sesión
    await cerrarSesion(driver);

    // Confirmar redirección a login
    await driver.wait(until.urlIs(BASE_URL + '/'), 5000);
    console.log('✅ Redirección a login después de logout confirmada');

    console.log(`✅ [${usuario.nombre}] login y logout completado con éxito`);
    return true;
  } catch (e) {
    console.error(`❌ [${usuario.nombre}] test login/logout falló:`, e.message);
    
    try {
      const screenshot = await driver.takeScreenshot();
      const fileName = `error-login-${usuario.nombre.replace(/\s+/g, '-')}-${Date.now()}.png`;
      require('fs').writeFileSync(fileName, screenshot, 'base64');
      console.log(`📸 Captura de pantalla guardada: ${fileName}`);
    } catch (screenshotError) {
      console.error('Error al tomar captura:', screenshotError);
    }
    
    throw e;
  } finally {
    await driver.quit();
  }
}

// --- Ejecución principal con reportes JUnit ---
(async () => {
  const builder = reportBuilder.newBuilder();
  const suite = builder.testSuite().name('Authentication Tests');
  let passedTests = 0;
  const totalTests = usuarios.length * 2; // Cada usuario tiene 2 tests
  
  try {
    console.log('======================================');
    console.log('🔐 INICIANDO PRUEBAS DE AUTENTICACIÓN');
    console.log(`🌐 URL Base: ${BASE_URL}`);
    console.log('======================================');
    
    for (const usuario of usuarios) {
      const testNameCredenciales = `Credenciales incorrectas - ${usuario.nombre}`;
      const testNameLogin = `Login y Logout - ${usuario.nombre}`;
      
      const testCaseCredenciales = suite.testCase()
        .className('Auth')
        .name(testNameCredenciales);
      
      const testCaseLogin = suite.testCase()
        .className('Auth')
        .name(testNameLogin);
      
      try {
        // Ejecutar test de credenciales incorrectas
        await testCredencialesIncorrectas(usuario);
        passedTests++;
        console.log(`✅ ${testNameCredenciales} pasó`);
      } catch (e) {
        console.error(`❌ ${testNameCredenciales} falló: ${e.message}`);
        testCaseCredenciales.failure(`Fallo en prueba: ${testNameCredenciales} - ${e.message}`);
      }
      
      try {
        // Ejecutar test de login/logout
        await testLoginLogout(usuario);
        passedTests++;
        console.log(`✅ ${testNameLogin} pasó`);
      } catch (e) {
        console.error(`❌ ${testNameLogin} falló: ${e.message}`);
        testCaseLogin.failure(`Fallo en prueba: ${testNameLogin} - ${e.message}`);
      }
    }
    
    builder.writeTo('auth-test-results.xml');
    console.log('\n📊 REPORTE DE PRUEBAS:');
    console.log(`✅ Pruebas exitosas: ${passedTests}/${totalTests}`);
    console.log(`❌ Pruebas fallidas: ${totalTests - passedTests}/${totalTests}`);
    
    if (passedTests < totalTests) {
      console.error('❌ ALERTA: Algunas pruebas fallaron');
      process.exit(1);
    } else {
      console.log('✅ TODAS LAS PRUEBAS DE AUTENTICACIÓN COMPLETADAS EXITOSAMENTE');
      process.exit(0);
    }
  } catch (globalError) {
    console.error('❌ ERROR GLOBAL EN EJECUCIÓN:', globalError);
    if (builder) builder.writeTo('auth-test-results.xml');
    process.exit(1);
  }
})();