# Proyecto 4 — Automatización del Login (Obra Social de Hogwarts)

Automatización de los 13 casos de prueba del Login dados por la cátedra, usando **Cucumber (Gherkin)** y **Playwright**. La ejecución muestra un resumen sencillo en la terminal y genera un reporte en Markdown.

## Requisitos
- [Node.js](https://nodejs.org/) (versión LTS)
- Conexión a Internet para acceder al sistema de prueba.

## Instalación
Desde la carpeta del proyecto:

```bash
npm install
npx playwright install chromium
```

## Ejecución
```bash
npm test
```

Al terminar, se genera `reporte.md` en la carpeta del proyecto. La terminal informa cuántos casos pasaron, cuáles fallaron y un breve resumen. Si uno o más casos fallan, `npm test` finaliza indicando que la ejecución tuvo fallas.

Para ver la ejecución más lenta, se puede configurar una pausa en milisegundos entre acciones:

En PowerShell:

```powershell
$env:SLOWMO=1000; npm test
```

En macOS o Linux:

```bash
SLOWMO=1000 npm test
```

## Casos de prueba
Se ejecutan los casos LOG-01 a LOG-13. El resultado puede variar según el sistema de prueba; si algún caso falla, la terminal y `reporte.md` indican qué resultado se esperaba y qué ocurrió.

## Estructura
```
cucumber.json                          configuración de cucumber-js
scripts/run-tests.js                   ejecuta las pruebas y genera el resumen y el reporte Markdown
features/
├── login.feature                      casos de test en Gherkin
├── pages/LoginPage.js                 Page Object: selectores y acciones del login
├── step_definitions/login.steps.js    implementación de los steps con Playwright
└── support/hooks.js                   apertura y cierre del navegador
```
