const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const reportBuilder = require('junit-report-builder');

const BASE_URL = "http://192.168.56.1:5173";

// --- Configuración del driver ---
const driverConfig = {
  browser: 'chrome',
  options: new chrome.Options()
    .addArguments('--no-sandbox')
    .addArguments('--disable-dev-shm-usage')
    .addArguments('--window-size=1920,1080')
    .headless() // Para CI
};

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

// --- Funciones auxiliares mejoradas ---
async function takeScreenshot(driver, fileName) {
  try {
    const screenshot = await driver.takeScreenshot();
    require('fs').writeFileSync(fileName, screenshot, 'base64');
    console.log(`📸 Captura guardada: ${fileName}`);
  } catch (error) {
    console.error('Error al tomar captura:', error);
  }
}

async function login(driver, rut, clave) {
  try {
    await driver.get(BASE_URL);
    await driver.wait(until.elementLocated(By.id('rut')), 15000);
    await driver.findElement(By.id('rut')).clear();
    await driver.findElement(By.id('rut')).sendKeys(rut);
    await driver.findElement(By.id('password')).clear();
    await driver.findElement(By.id('password')).sendKeys(clave);
    await driver.findElement(By.css('button[type="submit"]')).click();
  } catch (error) {
    console.error('Error durante login:', error);
    await takeScreenshot(driver, `error-login-${Date.now()}.png`);
    throw error;
  }
}

async function logout(driver) {
  try {
    console.log('Intentando cerrar sesión...');
    const cerrarBtn = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(.,'Cerrar sesión')]")),
      10000
    );
    await driver.executeScript("arguments[0].scrollIntoView(true);", cerrarBtn);
    await driver.executeScript("arguments[0].click();", cerrarBtn);
    await driver.wait(until.urlIs(BASE_URL + '/'), 10000);
    console.log('Sesión cerrada correctamente');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    await takeScreenshot(driver, `error-logout-${Date.now()}.png`);
    throw error;
  }
}

// --- Test: credenciales incorrectas ---
async function testCredencialesIncorrectas(usuario) {
  const testName = `Credenciales incorrectas - ${usuario.nombre}`;
  const testCase = suite.testCase()
    .className('Authentication')
    .name(testName);
  
  const driver = await new Builder()
    .forBrowser(driverConfig.browser)
    .setChromeOptions(driverConfig.options)
    .build();

  try {
    console.log(`🚀 Iniciando prueba: ${testName}`);
    
    await login(driver, '11111112-1', 'clave123');
    
    const errorMsg = await driver.wait(
      until.elementLocated(By.css('.error-message, [role="alert"], .alert-danger')),
      10000
    );
    
    await driver.wait(until.elementTextContains(errorMsg, 'Credenciales inválidas'), 5000);
    console.log(`✅ ${testName} pasó`);
    return { passed: true };
  } catch (e) {
    console.error(`❌ ${testName} falló: ${e.message}`);
    testCase.failure(`Fallo en prueba: ${e.message}`);
    await takeScreenshot(driver, `error-${testName.replace(/ /g, '-')}-${Date.now()}.png`);
    return { passed: false, error: e };
  } finally {
    try {
      await driver.quit();
    } catch (quitError) {
      console.error('Error al cerrar driver:', quitError);
    }
  }
}

// --- Test: login + logout ---
async function testLoginLogout(usuario) {
  const testName = `Login y Logout - ${usuario.nombre}`;
  const testCase = suite.testCase()
    .className('Authentication')
    .name(testName);
  
  const driver = await new Builder()
    .forBrowser(driverConfig.browser)
    .setChromeOptions(driverConfig.options)
    .build();

  try {
    console.log(`🚀 Iniciando prueba: ${testName}`);
    
    await login(driver, usuario.rut, usuario.clave);

    // Verificar redirección
    await driver.wait(until.urlContains(usuario.rutaHome), 15000);

    // Verificar contenido de la página
    const pageContent = await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(), "${usuario.textoHome}")]`)),
      10000
    );
    await driver.wait(until.elementIsVisible(pageContent), 5000);

    // Logout
    await logout(driver);

    console.log(`✅ ${testName} pasó`);
    return { passed: true };
  } catch (e) {
    console.error(`❌ ${testName} falló: ${e.message}`);
    testCase.failure(`Fallo en prueba: ${e.message}`);
    await takeScreenshot(driver, `error-${testName.replace(/ /g, '-')}-${Date.now()}.png`);
    return { passed: false, error: e };
  } finally {
    try {
      await driver.quit();
    } catch (quitError) {
      console.error('Error al cerrar driver:', quitError);
    }
  }
}

// --- Ejecución principal ---
(async () => {
  const builder = reportBuilder.newBuilder();
  const suite = builder.testSuite().name('Authentication Tests');
  let passedTests = 0;
  let totalTests = 0;

  try {
    console.log('======================================');
    console.log('🚀 INICIANDO PRUEBAS DE AUTENTICACIÓN');
    console.log(`🌐 URL Base: ${BASE_URL}`);
    console.log('======================================');
    
    // Ejecutar pruebas para cada usuario
    for (const usuario of usuarios) {
      // Test credenciales incorrectas
      totalTests++;
      const result1 = await testCredencialesIncorrectas(usuario);
      if (result1.passed) passedTests++;
      
      // Test login/logout
      totalTests++;
      const result2 = await testLoginLogout(usuario);
      if (result2.passed) passedTests++;
    }
    
    // Generar reporte
    builder.writeTo('auth-test-results.xml');
    
    console.log('\n📊 REPORTE DE PRUEBAS:');
    console.log(`✅ Pruebas exitosas: ${passedTests}/${totalTests}`);
    console.log(`❌ Pruebas fallidas: ${totalTests - passedTests}/${totalTests}`);
    
    if (passedTests < totalTests) {
      console.error('❌ ALERTA: Algunas pruebas fallaron');
      process.exit(1);
    } else {
      console.log('✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
      process.exit(0);
    }
  } catch (globalError) {
    console.error('❌ ERROR GLOBAL:', globalError);
    builder.writeTo('auth-test-results.xml');
    process.exit(1);
  }
})();