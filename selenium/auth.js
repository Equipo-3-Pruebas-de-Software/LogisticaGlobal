const { Builder, By, until } = require('selenium-webdriver');
const junit = require('junit-report-builder');

// --- Configuración ---
const BASE_URL = "http://192.168.56.1:5173";
const TIMEOUT = 10000; // 10 segundos para timeouts
const JUNIT_REPORT_PATH = 'selenium/auth-test-results.xml'; // Ruta del reporte JUnit

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

// --- Helpers ---
function formatTestHeader(testName, user) {
  return `\n📌 TEST: ${testName} - Usuario: ${user.nombre} (${user.rut})`;
}

function formatSuccess(message) {
  return `✅ ${message}`;
}

function formatFailure(error) {
  return `❌ ${error}`;
}

function formatStep(step) {
  return `  ↳ ${step}`;
}

// --- Función login ---
async function login(driver, rut, clave) {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.id('rut')), TIMEOUT);
  await driver.findElement(By.id('rut')).sendKeys(rut);
  await driver.findElement(By.id('password')).sendKeys(clave);
  await driver.findElement(By.css('button[type="submit"]')).click();
}

// --- Test: credenciales incorrectas ---
async function testCredencialesIncorrectas(usuario) {
  const testName = "Credenciales Incorrectas";
  const startTime = new Date();
  let success = false;
  let errorMessage = '';
  
  console.log(formatTestHeader(testName, usuario));
  
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    console.log(formatStep("Iniciando navegador..."));
    
    // Paso 1: Intentar login con credenciales incorrectas
    console.log(formatStep(`Intentando login con RUT: 11111112-1`));
    await login(driver, '11111112-1', 'clave123');
    
    // Paso 2: Verificar mensaje de error
    console.log(formatStep("Buscando mensaje de error..."));
    const errorMsg = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Credenciales inválidas')]")),
      TIMEOUT
    );
    await driver.wait(until.elementIsVisible(errorMsg), 2000);
    
    console.log(formatSuccess("Mensaje de error mostrado correctamente"));
    console.log(formatSuccess(`${testName} COMPLETADO EXITOSAMENTE`));
    success = true;
  } catch (e) {
    errorMessage = e.message;
    console.log(formatFailure(`Fallo en ${testName}: ${errorMessage}`));
    console.log(formatStep(`Última URL: ${await driver.getCurrentUrl()}`));
  } finally {
    await driver.quit();
    console.log(formatStep("Navegador cerrado"));
  }

  return {
    name: `${testName} - ${usuario.nombre}`,
    success,
    error: errorMessage,
    duration: new Date() - startTime
  };
}

// --- Test: login + logout ---
async function testLoginLogout(usuario) {
  const testName = "Login y Logout";
  const startTime = new Date();
  let success = false;
  let errorMessage = '';
  
  console.log(formatTestHeader(testName, usuario));
  
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    console.log(formatStep("Iniciando navegador..."));
    
    // Paso 1: Login
    console.log(formatStep(`Login con RUT: ${usuario.rut}`));
    await login(driver, usuario.rut, usuario.clave);
    
    // Paso 2: Verificar redirección
    console.log(formatStep(`Verificando redirección a ${usuario.rutaHome}...`));
    await driver.wait(until.urlContains(usuario.rutaHome), TIMEOUT);
    
    // Paso 3: Verificar contenido de la página
    console.log(formatStep(`Buscando texto: "${usuario.textoHome}"...`));
    let textoHome;
    if (usuario.nombre === "Margarita Rodriguez") {
      textoHome = await driver.wait(
        until.elementLocated(By.xpath(`//h1[contains(@class, 'dashboard-welcome') and contains(., '${usuario.nombre}')]`)),
        TIMEOUT
      );
    } else {
      textoHome = await driver.wait(
        until.elementLocated(By.xpath(`//*[contains(text(),"${usuario.textoHome}")]`)),
        TIMEOUT
      );
    }
    await driver.wait(until.elementIsVisible(textoHome), 2000);
    console.log(formatSuccess("Contenido de la página verificado"));
    
    // Paso 4: Logout
    console.log(formatStep("Realizando logout..."));
    const cerrarSesion = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(.,'Cerrar sesión') and (self::a or ancestor::a)]")),
      TIMEOUT
    );
    await cerrarSesion.click();
    
    // Paso 5: Verificar logout
    console.log(formatStep("Verificando redirección post-logout..."));
    await driver.wait(until.urlIs(BASE_URL + '/'), TIMEOUT);
    const loginText = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Iniciar Sesión')]")),
      TIMEOUT
    );
    await driver.wait(until.elementIsVisible(loginText), 2000);
    
    console.log(formatSuccess(`${testName} COMPLETADO EXITOSAMENTE`));
    success = true;
  } catch (e) {
    errorMessage = e.message;
    console.log(formatFailure(`Fallo en ${testName}: ${errorMessage}`));
    console.log(formatStep(`Última URL: ${await driver.getCurrentUrl()}`));
  } finally {
    await driver.quit();
    console.log(formatStep("Navegador cerrado"));
  }

  return {
    name: `${testName} - ${usuario.nombre}`,
    success,
    error: errorMessage,
    duration: new Date() - startTime
  };
}

// --- Ejecutar tests y generar reporte ---
(async () => {
  console.log('\n🚀 INICIANDO PRUEBAS DE AUTENTICACIÓN\n');
  console.log(`🔗 URL Base: ${BASE_URL}`);
  console.log(`🕒 Timeout configurado: ${TIMEOUT/1000} segundos`);
  
  // Crear suite de pruebas JUnit
  const suite = junit.testSuite().name('Pruebas de Autenticación');

  let testsTotales = 0;
  let testsExitosos = 0;
  const resultados = [];

  for (const user of usuarios) {
    // Test Credenciales Incorrectas
    const resultadoIncorrectas = await testCredencialesIncorrectas(user);
    const testCaseIncorrectas = suite.testCase()
      .name(resultadoIncorrectas.name)
      .time(resultadoIncorrectas.duration / 1000);
    
    if (!resultadoIncorrectas.success) {
      testCaseIncorrectas.failure(resultadoIncorrectas.error);
    }
    
    resultados.push(resultadoIncorrectas);
    testsTotales++;
    if (resultadoIncorrectas.success) testsExitosos++;
    
    // Test Login/Logout
    const resultadoLogin = await testLoginLogout(user);
    const testCaseLogin = suite.testCase()
      .name(resultadoLogin.name)
      .time(resultadoLogin.duration / 1000);
    
    if (!resultadoLogin.success) {
      testCaseLogin.failure(resultadoLogin.error);
    }
    
    resultados.push(resultadoLogin);
    testsTotales++;
    if (resultadoLogin.success) testsExitosos++;
  }

  // Escribir reporte JUnit
  junit.writeTo(JUNIT_REPORT_PATH);
  console.log(`\n📝 Reporte JUnit generado en: ${JUNIT_REPORT_PATH}`);

  // Resumen final
  console.log('\n📊 RESUMEN FINAL:');
  console.log(`🔹 Tests Totales: ${testsTotales}`);
  console.log(`🔹 Tests Exitosos: ${testsExitosos}`);
  console.log(`🔹 Tests Fallidos: ${testsTotales - testsExitosos}`);
  console.log(`🔹 Porcentaje Éxito: ${Math.round((testsExitosos/testsTotales)*100)}%`);
  
  // Detalle de fallos
  const testsFallidos = resultados.filter(r => !r.success);
  if (testsFallidos.length > 0) {
    console.log('\n🔴 TESTS FALLIDOS:');
    testsFallidos.forEach((test, i) => {
      console.log(`\n${i+1}. Test: ${test.name}`);
      console.log(`   Error: ${test.error}`);
    });
  }
  
  // Salir con código apropiado para Jenkins
  process.exit(testsFallidos.length > 0 ? 1 : 0);
})();