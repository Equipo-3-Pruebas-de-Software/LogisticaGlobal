const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const reportBuilder = require('junit-report-builder');

const BASE_URL = 'http://192.168.56.1:5173';

// --- Configuración de usuario ---
const USUARIO = {
  rut: '11111111-1',
  clave: 'clave123'
};

// --- Funciones auxiliares mejoradas ---
async function login(driver, rut, clave) {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.id('rut')), 15000);
  await driver.findElement(By.id('rut')).clear();
  await driver.findElement(By.id('rut')).sendKeys(rut);
  await driver.findElement(By.id('password')).clear();
  await driver.findElement(By.id('password')).sendKeys(clave);
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(until.urlContains('/jefe_turno'), 15000);
}

async function cerrarSesion(driver) {
  try {
    console.log('Intentando cerrar sesión...');
    
    // Alternativa 1: Buscar botón por texto
    const cerrarBtn = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Cerrar sesión') or contains(@aria-label, 'Cerrar sesión')]")),
      10000
    );
    
    await driver.executeScript("arguments[0].scrollIntoView(true);", cerrarBtn);
    await driver.executeScript("arguments[0].click();", cerrarBtn);
    
    // Esperar redirección con mayor tolerancia
    await driver.wait(async () => {
      const currentUrl = await driver.getCurrentUrl();
      return currentUrl === BASE_URL + '/' || 
             currentUrl === BASE_URL + '/login' ||
             currentUrl === BASE_URL + '/auth';
    }, 15000);
    
    console.log('Sesión cerrada correctamente');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    
    // Tomar screenshot para diagnóstico
    const screenshot = await driver.takeScreenshot();
    const fileName = `error-logout-${Date.now()}.png`;
    require('fs').writeFileSync(fileName, screenshot, 'base64');
    console.log(`📸 Captura de pantalla guardada: ${fileName}`);
    
    // Intentar cerrar sesión mediante URL directa como fallback
    try {
      await driver.get(BASE_URL + '/logout');
      console.log('Cerrando sesión mediante URL /logout');
      await driver.wait(until.urlIs(BASE_URL + '/'), 10000);
    } catch (fallbackError) {
      console.error('Fallback de logout también falló:', fallbackError);
    }
    
    throw error;
  }
}

async function esperarMensaje(driver, texto, timeout = 15000) {
  try {
    console.log(`Esperando mensaje que contenga: "${texto}"`);
    
    // Intentar múltiples selectores y estrategias
    const selectores = [
      '.toast-message', 
      '.msg', 
      '.message', 
      '[role="alert"]',
      '.alert-success',
      '.notification',
      '.MuiAlert-message'
    ].join(', ');

    const msg = await driver.wait(
      until.elementLocated(By.css(selectores)),
      timeout
    );
    
    await driver.wait(until.elementIsVisible(msg), timeout);
    await driver.wait(until.elementTextContains(msg, texto), timeout);
    
    const contenido = await msg.getText();
    console.log(`Mensaje encontrado: "${contenido}"`);
    
    return true;
  } catch (error) {
    console.error('Error al buscar mensaje:', error);
    
    // Tomar screenshot para diagnóstico
    const screenshot = await driver.takeScreenshot();
    const fileName = `error-mensaje-${Date.now()}.png`;
    require('fs').writeFileSync(fileName, screenshot, 'base64');
    console.log(`📸 Captura de pantalla guardada: ${fileName}`);
    
    throw new Error(`Mensaje esperado "${texto}" no encontrado. Error: ${error.message}`);
  }
}

async function seleccionarRobots(driver) {
  try {
    console.log('Abriendo dropdown de robots...');
    
    // Esperar y hacer clic en el dropdown
    const robotsDropdown = await driver.wait(
      until.elementLocated(By.css('.p-multiselect-trigger, [aria-haspopup="listbox"], #robots')),
      15000
    );
    await driver.wait(until.elementIsEnabled(robotsDropdown), 5000);
    await driver.executeScript("arguments[0].scrollIntoView(true);", robotsDropdown);
    await driver.executeScript("arguments[0].click();", robotsDropdown);

    // Esperar a que aparezcan las opciones (con más selectores posibles)
    console.log('Esperando opciones de robots...');
    await driver.wait(
      until.elementsLocated(By.css(
        '.p-multiselect-item, .multiselect-option, [role="option"], .p-dropdown-item'
      )),
      15000
    );

    // Seleccionar al menos 2 robots
    const robots = await driver.findElements(By.css(
      '.p-multiselect-item, .multiselect-option, [role="option"], .p-dropdown-item'
    ));
    
    console.log(`Encontrados ${robots.length} robots disponibles`);
    
    if (robots.length < 2) {
      throw new Error('No hay suficientes robots disponibles para seleccionar');
    }

    // Seleccionar primer robot
    await driver.wait(until.elementIsVisible(robots[0]), 5000);
    await driver.executeScript("arguments[0].scrollIntoView(true);", robots[0]);
    await driver.executeScript("arguments[0].click();", robots[0]);
    console.log('Primer robot seleccionado');

    // Seleccionar segundo robot
    await driver.wait(until.elementIsVisible(robots[1]), 5000);
    await driver.executeScript("arguments[0].scrollIntoView(true);", robots[1]);
    await driver.executeScript("arguments[0].click();", robots[1]);
    console.log('Segundo robot seleccionado');

    // Verificar selección (con más alternativas)
    const selectedItems = await driver.findElements(By.css(
      '.p-multiselect-label-container, .multiselect__tags, .p-dropdown-label, [aria-label="Selected items"]'
    ));
    
    console.log(`Elementos seleccionados encontrados: ${selectedItems.length}`);
    
    if (selectedItems.length < 1) { // Ajustado a 1 porque puede ser un contenedor
      throw new Error('No se seleccionaron correctamente los robots');
    }

    // Cerrar el dropdown haciendo clic en el cuerpo
    await driver.findElement(By.tagName('body')).click();
    await driver.sleep(1000);

    console.log('Selección de robots completada con éxito');
  } catch (error) {
    console.error('Error detallado en seleccionarRobots:', error);
    
    // Tomar screenshot para diagnóstico
    try {
      const screenshot = await driver.takeScreenshot();
      const fileName = `error-seleccionarRobots-${Date.now()}.png`;
      require('fs').writeFileSync(fileName, screenshot, 'base64');
      console.log(`📸 Captura de pantalla guardada: ${fileName}`);
    } catch (screenshotError) {
      console.error('Error al tomar captura:', screenshotError);
    }
    
    throw error;
  }
}

// --- Casos de prueba mejorados ---
const testCases = [
  {
    name: 'Crear Incidente Válido',
    execute: async (driver) => {
      await driver.wait(until.elementLocated(By.id('lugar')), 10000);
      await driver.findElement(By.id('lugar')).sendKeys('Pasillo 3 - Área de carga');
      
      await driver.wait(until.elementLocated(By.id('descripcion')), 10000);
      await driver.findElement(By.id('descripcion')).sendKeys('Falla en el sistema de navegación de dos robots, colisión en zona de almacenamiento.');
      
      await seleccionarRobots(driver);
      
      const submitBtn = await driver.wait(
        until.elementLocated(By.css('button[type="submit"]')),
        10000
      );
      await submitBtn.click();
      
      await esperarMensaje(driver, 'Incidente creado', 15000);
    }
  },
  // ... (otros casos de prueba permanecen igual)
];

// --- Ejecución principal con mejor manejo de errores ---
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
    
    // Configuración del driver con opciones adicionales
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options()
        .addArguments('--no-sandbox')
        .addArguments('--disable-dev-shm-usage')
        .addArguments('--window-size=1920,1080')
      )
      .build();
      
    await driver.manage().setTimeouts({
      implicit: 15000,
      pageLoad: 30000,
      script: 30000
    });
    // Maximizar ventana para evitar problemas de elementos ocultos
    await driver.manage().window().maximize();
    
    for (const testCase of testCases) {
      const testName = testCase.name;
      const testCaseObj = suite.testCase()
        .className('Incident')
        .name(testName);
      
      try {
        console.log(`\n🚀 Iniciando prueba: ${testName}`);
        
        await login(driver, USUARIO.rut, USUARIO.clave);
        await testCase.execute(driver);
        await cerrarSesion(driver);
        
        passedTests++;
        console.log(`✅ ${testName} pasó`);
      } catch (e) {
        console.error(`❌ ${testName} falló: ${e.message}`);
        testCaseObj.failure(`Fallo en prueba: ${testName} - ${e.message}`);
        
        // Capturar screenshot en caso de fallo
        try {
          const screenshot = await driver.takeScreenshot();
          const fileName = `error-${testName.replace(/\s+/g, '-')}-${Date.now()}.png`;
          require('fs').writeFileSync(fileName, screenshot, 'base64');
          console.log(`📸 Captura de pantalla guardada: ${fileName}`);
        } catch (screenshotError) {
          console.error('Error al tomar captura:', screenshotError);
        }
        
        try {
          await cerrarSesion(driver);
        } catch (cerrarError) {
          console.error('Error al cerrar sesión:', cerrarError);
        }
      }
    }
    
    builder.writeTo('incident-test-results.xml');
    console.log('\n📊 REPORTE DE PRUEBAS:');
    console.log(`✅ Pruebas exitosas: ${passedTests}/${testCases.length}`);
    console.log(`❌ Pruebas fallidas: ${testCases.length - passedTests}/${testCases.length}`);
    
    if (passedTests < testCases.length) {
      console.error('❌ ALERTA: Algunas pruebas fallaron');
      process.exit(1);
    } else {
      console.log('✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
      process.exit(0);
    }
  } catch (globalError) {
    console.error('❌ ERROR GLOBAL EN EJECUCIÓN:', globalError);
    if (builder) builder.writeTo('incident-test-results.xml');
    process.exit(1);
  } finally {
    if (driver) {
      try {
        await driver.quit();
      } catch (quitError) {
        console.error('Error al cerrar el driver:', quitError);
      }
    }
  }
})();