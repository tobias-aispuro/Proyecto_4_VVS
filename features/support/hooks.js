const { Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

setDefaultTimeout(60000);

BeforeAll(async function () {
  // Se ejecuta una vez antes de todos los tests
  global.browser = await chromium.launch({
    headless: false, // Cambiar a true para que no se abra la ventana
    slowMo: Number(process.env.SLOWMO) || 0, // ms de pausa entre acciones (ej: SLOWMO=1000)
  });
});

AfterAll(async function () {
  // Se ejecuta una vez después de todos los tests
  await global.browser.close();
});

Before(async function () {
  // Se ejecuta antes de cada escenario
  this.context = await global.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  // Se ejecuta después de cada escenario
  await this.page.close();
  await this.context.close();
});
