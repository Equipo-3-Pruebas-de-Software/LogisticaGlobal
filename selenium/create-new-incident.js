const { Builder, By, until, Key } = require('selenium-webdriver');

const BASE_URL = 'http://192.168.77.15:5173';

async function login(driver, rut, clave) {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.id('rut')), 5000);
  await driver.findElement(By.id('rut')).sendKeys(rut);
  await driver.findElement(By.id('password')).sendKeys(clave);
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(until.urlContains('/jefe_turno'), 5000);
}

async function cerrarSesion(driver) {
  const cerrarBtn = await driver.wait(
    until.elementLocated(By.xpath("//*[contains(.,'Cerrar sesión') and (self::a or ancestor::a)]")),
    5000
  );
  await cerrarBtn.click();

  // Esperar a que la URL sea la página login
  await driver.wait(until.urlIs(BASE_URL + '/'), 7000);

  // Esperar que el input rut esté visible (con tiempo extra)
  const inputRut = await driver.wait(until.elementLocated(By.id('rut')), 7000);
  await driver.wait(until.elementIsVisible(inputRut), 5000);
}

async function esperarMensaje(driver, texto) {
  const msg = await driver.wait(until.elementLocated(By.css('.msg')), 5000);
  await driver.wait(until.elementIsVisible(msg), 2000);
  const contenido = await msg.getText();
  if (!contenido.includes(texto)) {
    throw new Error(`Mensaje esperado "${texto}" no encontrado, texto actual: "${contenido}"`);
  }
}

async function seleccionarRobots(driver) {
  // Abrir el dropdown
  const robotsDiv = await driver.findElement(By.id('robots'));
  await robotsDiv.click();

  // Seleccionar primer elemento (buscar justo antes de click)
  let firstItem = await driver.wait(until.elementLocated(By.css('li.p-multiselect-item')), 5000);
  await driver.executeScript("arguments[0].scrollIntoView(true);", firstItem);
  await driver.wait(until.elementIsEnabled(firstItem), 3000);
  await driver.executeScript("arguments[0].click();", firstItem);

  // Seleccionar último elemento (buscar justo antes de click)
  let items = await driver.findElements(By.css('li.p-multiselect-item'));
  let lastItem = items[items.length - 1];
  await driver.executeScript("arguments[0].scrollIntoView(true);", lastItem);
  await driver.wait(until.elementIsEnabled(lastItem), 3000);
  await driver.executeScript("arguments[0].click();", lastItem);

  // Click afuera para cerrar menú desplegable
  await driver.findElement(By.tagName('body')).click();
}

async function testCrearIncidente() {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    await login(driver, '11111111-1', 'clave123');

    // Test crear nuevo incidente
    await driver.findElement(By.id('lugar')).sendKeys('Pasillo 3');
    await driver.findElement(By.id('descripcion')).sendKeys('Los robots chocaron. A uno de ellos se le salió la rueda izquierda, al otro se le rompió el brazo mecánico. Dejaron caer mercancías frágiles.');
    await seleccionarRobots(driver);
    await driver.findElement(By.css('button[type="submit"]')).click();
    await esperarMensaje(driver, 'Incidente creado');
    await cerrarSesion(driver);
    console.log('✅ Crear nuevo incidente pasó');

    // Test error por falta de lugar
    await login(driver, '11111111-1', 'clave123');
    await driver.findElement(By.id('descripcion')).sendKeys("Durante la manipulación de paquetes frágiles, el robot dejó caer una caja, resultando en daños en el contenido. Revisar sensores.");
    await driver.findElement(By.id('robots')).click();

    let items = await driver.wait(until.elementsLocated(By.css('li.p-multiselect-item')), 5000);
    await items[0].click();

    await driver.findElement(By.tagName('body')).click();
    await driver.findElement(By.css('button[type="submit"]')).click();
    await esperarMensaje(driver, 'Todos los campos son obligatorios');
    await cerrarSesion(driver);
    console.log('✅ Error falta lugar pasó');

    // Test error por falta de descripción
    await login(driver, '11111111-1', 'clave123');
    await driver.findElement(By.id('lugar')).sendKeys('Pasillo Norte');
    await driver.findElement(By.id('robots')).click();

    let items2 = await driver.wait(until.elementsLocated(By.css('li.p-multiselect-item')), 5000);
    await items2[0].click();

    await driver.findElement(By.tagName('body')).click();
    await driver.findElement(By.css('button[type="submit"]')).click();
    await esperarMensaje(driver, 'Todos los campos son obligatorios');
    await cerrarSesion(driver);
    console.log('✅ Error falta descripción pasó');

    // Test error por no seleccionar robots
    await login(driver, '11111111-1', 'clave123');
    await driver.findElement(By.id('lugar')).sendKeys('Pasillo Este');
    await driver.findElement(By.id('descripcion')).sendKeys("El robot se detuvo repentinamente en la zona de carga, causando un retraso en la operación. Se recomienda revisar el estado del robot y reiniciar su sistema.");

    await driver.findElement(By.tagName('body')).click();
    await driver.findElement(By.css('button[type="submit"]')).click();
    await esperarMensaje(driver, 'Todos los campos son obligatorios');
    await cerrarSesion(driver);
    console.log('✅ Error sin robots pasó');

  } catch (e) {
    console.error('❌ Test Crear Incidentes falló:', e);
  } finally {
    await driver.quit();
  }
}

(async () => {
  await testCrearIncidente();
})();
