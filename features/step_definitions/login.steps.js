const { Given, When, Then } = require('@cucumber/cucumber');
const { LoginPage } = require('../pages/LoginPage');

Given('que estoy en la página de login de la obra social', async function () {
  // this.page lo crea el hook Before (features/support/hooks.js)
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.abrir();
});

// {string} recibe el valor entre comillas que viene del .feature (puede ser "")
When('ingreso el correo {string} y la contraseña {string}', async function (correo, contrasena) {
  await this.loginPage.completarCredenciales(correo, contrasena);
});

When('hago clic en el botón Ingresar', async function () {
  await this.loginPage.ingresar();
});

// {int} recibe un número del .feature (ya convertido a Number)
When('intento ingresar {int} veces con el correo {string} y la contraseña {string}', async function (intentos, correo, contrasena) {
  for (let i = 0; i < intentos; i++) {
    await this.loginPage.completarCredenciales(correo, contrasena);
    await this.loginPage.ingresar();
  }
});

Then('debería ver la advertencia {string}', async function (mensaje) {
  await this.loginPage.verificarMensajeAdvertencia(mensaje);
});

Then('debería ver el mensaje de error {string}', async function (mensaje) {
  await this.loginPage.verificarMensajeError(mensaje);
});

Then('debería ser redirigido a la página principal', async function () {
  await this.loginPage.verificarRedireccionPaginaPrincipal();
});
