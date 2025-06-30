const { Builder, By, until, Key } = require('selenium-webdriver');

// --- Configuración ---
const BASE_URL = 'http://192.168.56.1:5173';
const TIMEOUT = 10000; // 10 segundos para timeouts
const USER = {
  rut: '11111111-1',
  clave: 'clave123'
};

// --- Helpers ---
function formatTestHeader(testName) {
  return `\n📌 TEST: ${testName}`;
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

// --- Funciones de apoyo ---
async function login(driver) {
  console.log(formatStep(`Iniciando sesión con RUT: ${USER.rut}`));
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.id('rut')), TIMEOUT);
  await driver.findElement(By.id('rut')).sendKeys(USER.rut);
  await driver.findElement(By.id('password')).sendKeys(USER.clave);
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(until.urlContains('/jefe_turno'), TIMEOUT);
  console.log(formatSuccess("Login exitoso"));
}

async function cerrarSesion(driver) {
  console.log(formatStep("Cerrando sesión..."));
  const cerrarBtn = await driver.wait(
    until.elementLocated(By.xpath("//*[contains(.,'Cerrar sesión') and (self::a or ancestor::a)]")),
    TIMEOUT
  );
  await cerrarBtn.click();
  await driver.wait(until.urlIs(BASE_URL + '/'), TIMEOUT);
  console.log(formatSuccess("Logout exitoso"));
}

async function esperarMensaje(driver, texto) {
  console.log(formatStep(`Buscando mensaje: "${texto}"`));
  const msg = await driver.wait(until.elementLocated(By.css('.msg')), TIMEOUT);
  await driver.wait(until.elementIsVisible(msg), 2000);
  const contenido = await msg.getText();
  if (!contenido.includes(texto)) {
    throw new Error(`Mensaje esperado "${texto}" no encontrado, texto actual: "${contenido}"`);
  }
  console.log(formatSuccess("Mensaje encontrado correctamente"));
}

async function seleccionarRobots(driver) {
  console.log(formatStep("Seleccionando robots..."));
  
  // Esperar a que el dropdown esté disponible
  const robotsDiv = await driver.wait(until.elementLocated(By.id('robots')), TIMEOUT);
  await driver.wait(until.elementIsVisible(robotsDiv), TIMEOUT);
  await robotsDiv.click();

  // Esperar a que los items estén disponibles
  await driver.wait(until.elementsLocated(By.css('li.p-multiselect-item')), TIMEOUT);
  
  // Seleccionar primer elemento
  const items = await driver.findElements(By.css('li.p-multiselect-item'));
  if (items.length === 0) {
    throw new Error("No se encontraron robots disponibles para seleccionar");
  }

  const firstItem = items[0];
  await driver.wait(until.elementIsVisible(firstItem), TIMEOUT);
  await firstItem.click();
  console.log(formatStep("Primer robot seleccionado"));

  // Seleccionar último elemento
  const lastItem = items[items.length - 1];
  await driver.wait(until.elementIsVisible(lastItem), TIMEOUT);
  await lastItem.click();
  console.log(formatStep("Último robot seleccionado"));

  // Cerrar menú desplegable
  await driver.findElement(By.tagName('body')).click();
  console.log(formatSuccess("Robots seleccionados correctamente"));
}

async function navegarAFormularioIncidente(driver) {
  console.log(formatStep("Navegando al formulario de incidentes..."));
  try {
    // Esperar a que la página se cargue completamente
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Crear Incidente')]")), TIMEOUT);
    const crearIncidenteBtn = await driver.findElement(By.xpath("//*[contains(text(), 'Crear Incidente')]"));
    await crearIncidenteBtn.click();
    
    // Esperar a que el formulario esté visible
    await driver.wait(until.elementLocated(By.id('lugar')), TIMEOUT);
    console.log(formatSuccess("Formulario de incidente cargado correctamente"));
  } catch (e) {
    console.log(formatFailure("No se pudo cargar el formulario de incidente"));
    throw e;
  }
}

// --- Tests ---
async function testCrearIncidenteValido() {
  const testName = "Crear Incidente Válido";
  console.log(formatTestHeader(testName));
  
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    await login(driver);
    await navegarAFormularioIncidente(driver);

    // Paso 1: Llenar formulario
    console.log(formatStep("Llenando formulario..."));
    const lugarInput = await driver.wait(until.elementLocated(By.id('lugar')), TIMEOUT);
    await lugarInput.sendKeys('Pasillo 3');
    
    const descripcionInput = await driver.findElement(By.id('descripcion'));
    await descripcionInput.sendKeys('Los robots chocaron. A uno de ellos se le salió la rueda izquierda, al otro se le rompió el brazo mecánico. Dejaron caer mercancías frágiles.');
    
    await seleccionarRobots(driver);

    // Paso 2: Enviar formulario
    console.log(formatStep("Enviando formulario..."));
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    
    await esperarMensaje(driver, 'Incidente creado');

    await cerrarSesion(driver);
    console.log(formatSuccess(`${testName} COMPLETADO EXITOSAMENTE`));
    return { success: true };
  } catch (e) {
    console.log(formatFailure(`Fallo en ${testName}: ${e.message}`));
    return { success: false, error: e.message };
  } finally {
    await driver.quit();
  }
}

async function testErrorFaltaLugar() {
  const testName = "Validación - Falta Lugar";
  console.log(formatTestHeader(testName));
  
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    await login(driver);
    await navegarAFormularioIncidente(driver);

    // Paso 1: Llenar formulario sin lugar
    console.log(formatStep("Llenando formulario sin lugar..."));
    const descripcionInput = await driver.findElement(By.id('descripcion'));
    await descripcionInput.sendKeys("Durante la manipulación de paquetes frágiles, el robot dejó caer una caja, resultando en daños en el contenido. Revisar sensores.");
    
    await seleccionarRobots(driver);

    // Paso 2: Enviar formulario
    console.log(formatStep("Enviando formulario incompleto..."));
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    
    await esperarMensaje(driver, 'Todos los campos son obligatorios');

    await cerrarSesion(driver);
    console.log(formatSuccess(`${testName} COMPLETADO EXITOSAMENTE`));
    return { success: true };
  } catch (e) {
    console.log(formatFailure(`Fallo en ${testName}: ${e.message}`));
    return { success: false, error: e.message };
  } finally {
    await driver.quit();
  }
}

async function testErrorFaltaDescripcion() {
  const testName = "Validación - Falta Descripción";
  console.log(formatTestHeader(testName));
  
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    await login(driver);
    await navegarAFormularioIncidente(driver);

    // Paso 1: Llenar formulario sin descripción
    console.log(formatStep("Llenando formulario sin descripción..."));
    const lugarInput = await driver.findElement(By.id('lugar'));
    await lugarInput.sendKeys('Pasillo Norte');
    
    await seleccionarRobots(driver);

    // Paso 2: Enviar formulario
    console.log(formatStep("Enviando formulario incompleto..."));
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    
    await esperarMensaje(driver, 'Todos los campos son obligatorios');

    await cerrarSesion(driver);
    console.log(formatSuccess(`${testName} COMPLETADO EXITOSAMENTE`));
    return { success: true };
  } catch (e) {
    console.log(formatFailure(`Fallo en ${testName}: ${e.message}`));
    return { success: false, error: e.message };
  } finally {
    await driver.quit();
  }
}

async function testErrorSinRobots() {
  const testName = "Validación - Sin Robots Seleccionados";
  console.log(formatTestHeader(testName));
  
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    await login(driver);
    await navegarAFormularioIncidente(driver);

    // Paso 1: Llenar formulario sin robots
    console.log(formatStep("Llenando formulario sin robots..."));
    const lugarInput = await driver.findElement(By.id('lugar'));
    await lugarInput.sendKeys('Pasillo Este');
    
    const descripcionInput = await driver.findElement(By.id('descripcion'));
    await descripcionInput.sendKeys("El robot se detuvo repentinamente en la zona de carga, causando un retraso en la operación. Se recomienda revisar el estado del robot y reiniciar su sistema.");

    // Paso 2: Enviar formulario
    console.log(formatStep("Enviando formulario incompleto..."));
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    
    await esperarMensaje(driver, 'Todos los campos son obligatorios');

    await cerrarSesion(driver);
    console.log(formatSuccess(`${testName} COMPLETADO EXITOSAMENTE`));
    return { success: true };
  } catch (e) {
    console.log(formatFailure(`Fallo en ${testName}: ${e.message}`));
    return { success: false, error: e.message };
  } finally {
    await driver.quit();
  }
}

// --- Ejecución y Reporte ---
(async () => {
  console.log('\n🚀 INICIANDO PRUEBAS DE CREACIÓN DE INCIDENTES\n');
  console.log(`🔗 URL Base: ${BASE_URL}`);
  console.log(`👤 Usuario de prueba: ${USER.rut}`);
  console.log(`🕒 Timeout configurado: ${TIMEOUT/1000} segundos`);

  const tests = [
    { name: "Incidente Válido", fn: testCrearIncidenteValido },
    { name: "Validación Falta Lugar", fn: testErrorFaltaLugar },
    { name: "Validación Falta Descripción", fn: testErrorFaltaDescripcion },
    { name: "Validación Sin Robots", fn: testErrorSinRobots }
  ];

  let testsTotales = tests.length;
  let testsExitosos = 0;
  const resultados = [];

  for (const test of tests) {
    const resultado = await test.fn();
    resultados.push({
      test: test.name,
      ...resultado
    });
    if (resultado.success) testsExitosos++;
  }

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
      console.log(`\n${i+1}. Test: ${test.test}`);
      console.log(`   Error: ${test.error}`);
    });
  }

  // Salir con código apropiado para Jenkins
  process.exit(testsFallidos.length > 0 ? 1 : 0);
})();