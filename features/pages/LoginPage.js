const { expect } = require('@playwright/test');

const URL_LOGIN = 'http://www.cs.uns.edu.ar/~mll/temp/testing/hogwarts/login.html';

// Page Object: concentra los selectores y acciones de la página de login.
// Si cambia el HTML, solo hay que tocar este archivo.
class LoginPage {
  constructor(page) {
    this.page = page;
    this.inputCorreo = page.locator('#email');
    this.inputContrasena = page.locator('#password');
    this.botonIngresar = page.getByRole('button', { name: 'Ingresar' });
    this.mensajeError = page.locator('#error-message');
    this.mensajeAdvertencia = page.locator('#warning-message');
  }

  async abrir() {
    await this.page.goto(URL_LOGIN);
  }

  async completarCredenciales(correo, contrasena) {
    await this.inputCorreo.fill(correo);
    await this.inputContrasena.fill(contrasena);
  }

  async ingresar() {
    await this.botonIngresar.click();
  }

  async verificarMensajeError(mensaje) {
    await expect(this.mensajeError).toHaveText(mensaje);
  }

  async verificarMensajeAdvertencia(mensaje) {
    await expect(this.mensajeAdvertencia).toHaveText(mensaje);
  }

  // Login exitoso: la página redirige a bienvenida.html, que muestra el menú del usuario
  async verificarRedireccionPaginaPrincipal() {
    await expect(this.page).toHaveURL(/bienvenida\.html$/);
    await expect(this.page.getByRole('link', { name: 'Salir' })).toBeVisible();
  }
}

module.exports = { LoginPage };
