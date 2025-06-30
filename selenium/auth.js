const { Builder, By, until } = require('selenium-webdriver');

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

const BASE_URL = "http://192.168.77.15:5173";

// --- Función login ---
async function login(driver, rut, clave) {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.id('rut')), 5000);
  await driver.findElement(By.id('rut')).sendKeys(rut);
  await driver.findElement(By.id('password')).sendKeys(clave);
  await driver.findElement(By.css('button[type="submit"]')).click();
}

// --- Test: credenciales incorrectas ---
async function testCredencialesIncorrectas(nombreUsuario) {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    await login(driver, '11111112-1', 'clave123');
    const errorMsg = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Credenciales inválidas')]")),
      5000
    );
    await driver.wait(until.elementIsVisible(errorMsg), 2000);
    console.log(`✅ [${nombreUsuario}] test de credenciales incorrectas pasó`);
  } catch (e) {
    console.error(`❌ [${nombreUsuario}] test credenciales incorrectas falló:`, e.message);
  } finally {
    await driver.quit();
  }
}

// --- Test: login + logout ---
async function testLoginLogout(usuario) {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    await login(driver, usuario.rut, usuario.clave);

    // Esperar ruta específica
    await driver.wait(until.urlContains(usuario.rutaHome), 5000);

    // Esperar texto visible en home
    let textoHome;
    if (usuario.nombre === "Margarita Rodriguez") {
      // Para supervisor: buscar h1.dashboard-welcome que contenga el nombre (parcialmente)
      textoHome = await driver.wait(
        until.elementLocated(By.xpath(`//h1[contains(@class, 'dashboard-welcome') and contains(., '${usuario.nombre}')]`)),
        7000
      );
    } else {
      // Para otros usuarios: buscar texto exacto en cualquier lugar
      textoHome = await driver.wait(
        until.elementLocated(By.xpath(`//*[contains(text(),"${usuario.textoHome}")]`)),
        5000
      );
    }
    await driver.wait(until.elementIsVisible(textoHome), 2000);

    // Cerrar sesión (búsqueda flexible)
    const cerrarSesion = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(.,'Cerrar sesión') and (self::a or ancestor::a)]")),
      5000
    );
    await cerrarSesion.click();

    // Confirmar redirección a login
    await driver.wait(until.urlIs(BASE_URL + '/'), 5000);
    const loginText = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Iniciar Sesión')]")),
      5000
    );
    await driver.wait(until.elementIsVisible(loginText), 2000);

    console.log(`✅ [${usuario.nombre}] login y logout pasó`);
  } catch (e) {
    console.error(`❌ [${usuario.nombre}] test login/logout falló:`, e.message);
  } finally {
    await driver.quit();
  }
}


// --- Ejecutar todos los tests ---
(async () => {
  for (const user of usuarios) {
    await testCredencialesIncorrectas(user.nombre);
    await testLoginLogout(user);
  }
})();
