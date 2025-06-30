const { Builder, By, until } = require('selenium-webdriver');
const reportBuilder = require('junit-report-builder');

const BASE_URL = "http://192.168.56.1:5173";

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

// Contadores para reportes
let totalTests = 0;
let passedTests = 0;
const builder = reportBuilder.newBuilder();
const suite = builder.testSuite().name('Authentication Tests');

// --- Función login ---
async function login(driver, rut, clave) {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.id('rut')), 10000);
  await driver.findElement(By.id('rut')).sendKeys(rut);
  await driver.findElement(By.id('password')).sendKeys(clave);
  await driver.findElement(By.css('button[type="submit"]')).click();
}

// --- Test: credenciales incorrectas ---
async function testCredencialesIncorrectas(usuario) {
  totalTests++;
  const testName = `Credenciales incorrectas - ${usuario.nombre}`;
  const testCase = suite.testCase()
    .className('Authentication')
    .name(testName);
  
  const driver = await new Builder().forBrowser('chrome').build();
  
  try {
    console.log(`🚀 Iniciando prueba: ${testName}`);
    
    await login(driver, '11111112-1', 'clave123');
    
    const errorMsg = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Credenciales inválidas')]")),
      7000
    );
    
    await driver.wait(until.elementIsVisible(errorMsg), 3000);
    console.log(`✅ [${usuario.nombre}] test de credenciales incorrectas pasó`);
    passedTests++;
  } catch (e) {
    console.error(`❌ [${usuario.nombre}] test credenciales incorrectas falló: ${e.message}`);
    testCase.failure(`Fallo en prueba: ${testName} - ${e.message}`);
    console.error('Stack trace:', e.stack);
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
  totalTests++;
  const testName = `Login y Logout - ${usuario.nombre}`;
  const testCase = suite.testCase()
    .className('Authentication')
    .name(testName);
  
  const driver = await new Builder().forBrowser('chrome').build();
  
  try {
    console.log(`🚀 Iniciando prueba: ${testName}`);
    
    await login(driver, usuario.rut, usuario.clave);

    // Esperar ruta específica
    await driver.wait(until.urlContains(usuario.rutaHome), 10000);

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
        8000
      );
    }
    await driver.wait(until.elementIsVisible(textoHome), 3000);

    // Cerrar sesión
    const cerrarSesion = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(.,'Cerrar sesión') and (self::a or ancestor::a)]")),
      7000
    );
    await cerrarSesion.click();

    // Confirmar redirección a login
    await driver.wait(until.urlIs(BASE_URL + '/'), 8000);
    const loginText = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Iniciar Sesión')]")),
      7000
    );
    await driver.wait(until.elementIsVisible(loginText), 3000);

    console.log(`✅ [${usuario.nombre}] login y logout pasó`);
    passedTests++;
  } catch (e) {
    console.error(`❌ [${usuario.nombre}] test login/logout falló: ${e.message}`);
    testCase.failure(`Fallo en prueba: ${testName} - ${e.message}`);
    console.error('Stack trace:', e.stack);
  } finally {
    try {
      await driver.quit();
    } catch (quitError) {
      console.error('Error al cerrar driver:', quitError);
    }
  }
}

// --- Ejecutar todos los tests ---
(async () => {
  try {
    console.log('======================================');
    console.log('🚀 INICIANDO PRUEBAS DE AUTENTICACIÓN');
    console.log(`🌐 URL Base: ${BASE_URL}`);
    console.log('======================================');
    
    // Ejecutar pruebas para cada usuario
    for (const user of usuarios) {
      await testCredencialesIncorrectas(user);
      await testLoginLogout(user);
    }
    
    // Generar reporte JUnit
    builder.writeTo('auth-test-results.xml');
    console.log('\n📊 REPORTE DE PRUEBAS:');
    console.log(`✅ Pruebas exitosas: ${passedTests}/${totalTests}`);
    console.log(`❌ Pruebas fallidas: ${totalTests - passedTests}/${totalTests}`);
    console.log('📄 Reporte generado: auth-test-results.xml');
    
    // Finalizar con código de salida apropiado
    if (passedTests < totalTests) {
      console.error('❌ ALERTA: Algunas pruebas fallaron');
      process.exit(1);
    } else {
      console.log('✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
      process.exit(0);
    }
  } catch (globalError) {
    console.error('❌ ERROR GLOBAL EN EJECUCIÓN:', globalError);
    builder.writeTo('auth-test-results.xml');
    process.exit(1);
  }
})();