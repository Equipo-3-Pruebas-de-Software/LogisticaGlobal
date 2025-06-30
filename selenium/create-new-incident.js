const { Builder, By, until, Key } = require('selenium-webdriver');
const junit = require('junit-report-builder');

// --- Configuración ---
const BASE_URL = 'http://192.168.56.1:5173';
const TIMEOUT = 10000; // 10 segundos para timeouts
const USER = {
  rut: '11111111-1',
  clave: 'clave123'
};
const JUNIT_REPORT_PATH = 'selenium/test-results.xml'; // Ruta donde se guardará el reporte

// --- Helpers ---
// ... (mantén tus funciones helpers existentes como formatTestHeader, formatSuccess, etc.)

// --- Funciones de apoyo ---
// ... (mantén tus funciones de apoyo existentes como login, cerrarSesion, etc.)

// Modifica tus funciones de prueba para que devuelvan más información
async function testCrearIncidenteValido() {
  const testName = "Crear Incidente Válido";
  const startTime = new Date();
  let success = false;
  let errorMessage = '';
  
  console.log(formatTestHeader(testName));
  
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    // ... (código existente de la prueba)
    success = true;
  } catch (e) {
    errorMessage = e.message;
    console.log(formatFailure(`Fallo en ${testName}: ${errorMessage}`));
  } finally {
    await driver.quit();
  }

  return {
    name: testName,
    success,
    error: errorMessage,
    duration: new Date() - startTime
  };
}

// ... (haz lo mismo para las otras funciones de prueba testErrorFaltaLugar, testErrorFaltaDescripcion, testErrorSinRobots)

// --- Ejecución y Reporte ---
(async () => {
  console.log('\n🚀 INICIANDO PRUEBAS DE CREACIÓN DE INCIDENTES\n');
  // ... (mensajes iniciales existentes)

  const tests = [
    { name: "Incidente Válido", fn: testCrearIncidenteValido },
    { name: "Validación Falta Lugar", fn: testErrorFaltaLugar },
    { name: "Validación Falta Descripción", fn: testErrorFaltaDescripcion },
    { name: "Validación Sin Robots", fn: testErrorSinRobots }
  ];

  // Crear el reporte JUnit
  const suite = junit.testSuite().name('Pruebas de Creación de Incidentes');

  for (const test of tests) {
    const result = await test.fn();
    
    const testCase = suite.testCase()
      .name(result.name)
      .time(result.duration / 1000); // Convertir a segundos
    
    if (!result.success) {
      testCase.failure(result.error);
    }
  }

  // Escribir el reporte
  junit.writeTo(JUNIT_REPORT_PATH);
  console.log(`\n📝 Reporte JUnit generado en: ${JUNIT_REPORT_PATH}`);

  // Resumen final
  const testsExitosos = tests.filter(t => t.result?.success).length;
  const testsTotales = tests.length;
  
  console.log('\n📊 RESUMEN FINAL:');
  console.log(`🔹 Tests Totales: ${testsTotales}`);
  console.log(`🔹 Tests Exitosos: ${testsExitosos}`);
  console.log(`🔹 Tests Fallidos: ${testsTotales - testsExitosos}`);
  console.log(`🔹 Porcentaje Éxito: ${Math.round((testsExitosos/testsTotales)*100)}%`);

  // Salir con código apropiado para Jenkins
  process.exit(testsExitosos === testsTotales ? 0 : 1);
})();