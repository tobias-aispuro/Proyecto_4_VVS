# Proyecto 4 — Automatización del Login (Obra Social de Hogwarts)

Automatización de los 13 casos de test del Login dados por la cátedra, usando **Cucumber (Gherkin)** y **Playwright**.

## Requisitos
- [Node.js](https://nodejs.org/) (versión LTS)

## Instalación
Desde la carpeta del proyecto:

```bash
npm install
npx playwright install chromium
```

## Ejecución
```bash
npx cucumber-js
```

Para ver la ejecución más lenta (pausa en milisegundos entre cada acción):

```bash
SLOWMO=1000 npx cucumber-js
```

Al terminar se genera el reporte `reporte.html` en la carpeta del proyecto.

## Resultado esperado
- **12 escenarios pasan** (LOG-01 a LOG-12).
- **LOG-13 falla**: la advertencia "Atención, su cuenta está a punto de ser bloqueada." no aparece al 3er intento fallido, sino recién al 4º. Es un defecto del sistema bajo prueba, no del test.

## Estructura
```
cucumber.json                          configuración de cucumber-js
features/
├── login.feature                      casos de test en Gherkin
├── pages/LoginPage.js                 Page Object: selectores y acciones del login
├── step_definitions/login.steps.js    implementación de los steps con Playwright
└── support/hooks.js                   apertura y cierre del navegador
```
