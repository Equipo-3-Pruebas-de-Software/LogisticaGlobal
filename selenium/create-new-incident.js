const { Builder, By, until } = require('selenium-webdriver');
const reportBuilder = require('junit-report-builder');

// --- Configuración dinámica de URL ---
const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// --- Configuración de usuario ---
const USUARIO = {
  rut: '11111111-1',
  clave: 'clave123'
};

// --- Funciones auxiliares ---
async function login(driver, rut, clave) {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.id('rut')), 10000);
  await driver.findElement(By.id('rut')).sendKeys(rut);
  await driver.findElement(By.id('password')).sendKeys(clave);
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(until.urlContains('/jefe_turno'), 10000);
}

async function cerrarSesion(driver) {
  const cerrarBtn = await driver.wait(
    until.elementLocated(By.xpath("//*[contains(.,'Cerrar sesión') and (self::a or ancestor::a)]")),
    7000
  );
  await cerrarBtn.click();
  await driver.wait(until.urlIs(BASE_URL + '/'), 8000);
  await driver.wait(until.elementLocated(By.id('rut')), 5000);
}

async function esperarMensaje(driver, texto) {
  const msg = await driver.wait(until.elementLocated(By.css('.msg')), 5000);
  await driver.wait(until.elementIsVisible(msg), 3000);
  const contenido = await msg.getText();
  if (!contenido.includes(texto)) {
    throw new Error(`Mensaje esperado "${texto}" no encontrado. Contenido: "${contenido}"`);
  }
}

async function seleccionarRobots(driver) {
  // Abrir el dropdown
  const robotsDiv = await driver.findElement(By.id('robots'));
  await robotsDiv.click();

  // Seleccionar primer robot
  let firstItem = await driver.wait(until.elementLocated(By.css('li.p-multiselect-item')), 5000);
  await driver.executeScript("arguments[0].scrollIntoView(true);", firstItem);
  await driver.wait(until.elementIsEnabled(firstItem), 3000);
  await firstItem.click();

  // Seleccionar último robot
  let items = await driver.findElements(By.css('li.p-multiselect-item'));
  let lastItem = items[items.length - 1];
  await driver.executeScript("arguments[0].scrollIntoView(true);", lastItem);
  await driver.wait(until.elementIsEnabled(lastItem), 3000);
  await lastItem.click();

  // Click afuera para cerrar menú desplegable
  await driver.findElement(By.tagName('body')).click();
}

// --- Casos de prueba ---
const testCases = [
  {
    name: 'Crear Incidente Válido',
    execute: async (driver) => {
      await driver.findElement(By.id('lugar')).sendKeys('Pasillo 3');
      await driver.findElement(By.id('descripcion')).sendKeys('Los robots chocaron. A uno de ellos se le salió la rueda izquierda, al otro se le rompió el brazo mecánico. Dejaron caer mercancías frágiles.');
      await seleccionarRobots(driver);
      await driver.findElement(By.css('button[type="submit"]')).click();
      await esperarMensaje(driver, 'Incidente creado');
    }
  },
  {
    name: 'Validación Falta Lugar',
    execute: async (driver) => {
      await driver.findElement(By.id('descripcion')).sendKeys("Durante la manipulación de paquetes frágiles, el robot dejó caer una caja, resultando en daños en el contenido. Revisar sensores.");
      await driver.findElement(By.id('robots')).click();
      let items = await driver.wait(until.elementsLocated(By.css('li.p-multiselect-item')), 5000);
      await items[0].click();
      await driver.findElement(By.tagName('body')).click();
      await driver.findElement(By.css('button[type="submit"]')).click();
      await esperarMensaje(driver, 'Todos los campos son obligatorios');
    }
  },
  {
    name: 'Validación Falta Descripción',
    execute: async (driver) => {
      await driver.findElement(By.id('lugar')).sendKeys('Pasillo Norte');
      await driver.findElement(By.id('robots')).click();
      let items = await driver.wait(until.elementsLocated(By.css('li.p-multiselect-item')), 5000);
      await items[0].click();
      await driver.findElement(By.tagName('body')).click();
      await driver.findElement(By.css('button[type="submit"]')).click();
      await esperarMensaje(driver, 'Todos los campos son obligatorios');
    }
  },
  {
    name: 'Validación Sin Robots',
    execute: async (driver) => {
      await driver.findElement(By.id('lugar')).sendKeys('Pasillo Este');
      await driver.findElement(By.id('descripcion')).sendKeys("El robot se detuvo repentinamente en la zona de carga, causando un retraso en la operación. Se recomienda revisar el estado del robot y reiniciar su sistema.");
      await driver.findElement(By.css('button[type="submit"]')).click();
      await esperarMensaje(driver, 'Todos los campos son obligatorios');
    }
  }
];

// --- Ejecución principal ---
(async () => {
  const builder = reportBuilder.newBuilder();
  const suite = builder.testSuite().name('Incident Tests');
  let passedTests = 0;
  let driver = null;

  try {
    console.log('======================================');
    console.log('🚀 INICIANDO PRUEBAS DE INCIDENTES');
    console.log(`🌐 URL Base: ${BASE_URL}`);
    console.log('======================================');
    
    // Crear instancia de navegador
    driver = await new Builder().forBrowser('chrome').build();
    
    // Ejecutar cada caso de prueba
    for (const testCase of testCases) {
      const testName = testCase.name;
      const testCaseObj = suite.testCase()
        .className('Incident')
        .name(testName);
      
      try {
        console.log(`\n🚀 Iniciando prueba: ${testName}`);
        
        // Iniciar sesión
        await login(driver, USUARIO.rut, USUARIO.clave);
        
        // Ejecutar caso de prueba
        await testCase.execute(driver);
        
        // Cerrar sesión
        await cerrarSesion(driver);
        
        passedTests++;
        console.log(`✅ ${testName} pasó`);
      } catch (e) {
        console.error(`❌ ${testName} falló: ${e.message}`);
        testCaseObj.failure(`Fallo en prueba: ${testName} - ${e.message}`);
        console.error('Stack trace:', e.stack);
        
        // Intentar cerrar sesión si falla una prueba
        try {
          await cerrarSesion(driver);
        } catch (cerrarError) {
          console.error('Error al cerrar sesión:', cerrarError);
        }
      }
    }
    
    // Generar reporte JUnit
    builder.writeTo('incident-test-results.xml');
    
    console.log('\n📊 REPORTE DE PRUEBAS:');
    console.log(`✅ Pruebas exitosas: ${passedTests}/${testCases.length}`);
    console.log(`❌ Pruebas fallidas: ${testCases.length - passedTests}/${testCases.length}`);
    console.log('📄 Reporte generado: incident-test-results.xml');
    
    // Finalizar con código de salida apropiado
    if (passedTests < testCases.length) {
      console.error('❌ ALERTA: Algunas pruebas fallaron');
      process.exit(1);
    } else {
      console.log('✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
      process.exit(0);
    }
  } catch (globalError) {
    console.error('❌ ERROR GLOBAL EN EJECUCIÓN:', globalError);
    
    // Generar reporte incluso con error global
    if (builder) {
      builder.writeTo('incident-test-results.xml');
    }
    
    process.exit(1);
  } finally {
    // Cerrar el navegador si está abierto
    if (driver) {
      try {
        await driver.quit();
      } catch (quitError) {
        console.error('Error al cerrar el driver:', quitError);
      }
    }
  }
})();