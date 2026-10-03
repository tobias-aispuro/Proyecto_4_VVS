# Proyecto 4 — Automatización del Login (Verificación y Validación de Software, UNS)

## Contexto
Sistema bajo prueba: web de reintegros de la **Obra Social de los Trabajadores de Hogwarts** (ya testeada a mano en el Proyecto 2).
Objetivo: automatizar **todos los casos de test del Login** que da la cátedra (planilla `Casos_de_test-Login__para_P4_.xlsx`).
**No se agregan casos extra**: solo los 13 de la planilla.

## Consigna (requisitos de aprobación)
1. Describir los casos con **Cucumber usando Gherkin** (`.feature`).
2. Implementar los escenarios con **Playwright** (step definitions).
3. **Obligatorio:** usar el **pasaje de información entre Cucumber y Playwright** (parámetros `{string}` en los steps y `Scenario Outline` + `Examples`).
4. Entregable: `.zip` del proyecto (sin `node_modules`), nombre: `nro de comisión - apellido 1 - apellido 2 - Proyecto 4`.
5. Incluir **README** breve con los pasos para ejecutarlo.
6. Asegurar que esté el **`cucumber.json`** (archivo de configuración de cucumber-js).
7. Antes de entregar: descomprimir en otra carpeta, `npm install`, ejecutar como un tercero.

## Stack
- Node.js (LTS), JavaScript (CommonJS).
- Dependencias de desarrollo: `@cucumber/cucumber`, `@playwright/test`.
- Navegador: `npx playwright install chromium`.
- `expect` se importa desde `@playwright/test`.
- Ejecutar: `npx cucumber-js`.

## Estructura de carpetas
```
proyecto4/
├── cucumber.json
├── package.json
├── README.md
└── features/
    ├── login.feature              ← los 13 casos
    ├── pages/
    │   └── LoginPage.js           ← Page Object: selectores y acciones del login
    ├── step_definitions/
    │   └── login.steps.js         ← steps reutilizables (uno por frase distinta)
    └── support/
        └── hooks.js               ← Before/After: abrir y cerrar el navegador
```

## cucumber.json
```json
{
  "default": {
    "paths": ["features/**/*.feature"],
    "require": ["features/**/*.js"],
    "format": ["progress", "html:reporte.html"]
  }
}
```

## Casos de la cátedra (planilla)
Datos: correo registrado `ron@hogwarts.com`, correo no registrado `vyvs@mail.com`, correo inválido `harry.com`, contraseña válida `hermione2025`, contraseña inválida `123`.

| ID | Correo | Contraseña | Resultado esperado | Resultado observado (P2) |
|---|---|---|---|---|
| LOG-01 | (vacío) | (vacío) | "Por favor, completa ambos campos." | igual |
| LOG-02 | (vacío) | hermione2025 | "Por favor, completa ambos campos." | igual |
| LOG-03 | (vacío) | 123 | "Por favor, completa ambos campos." | igual |
| LOG-04 | ron@hogwarts.com | (vacío) | "Por favor, completa ambos campos." | igual |
| LOG-05 | ron@hogwarts.com | hermione2025 | Acceso autorizado. Redirección a la página principal. | igual |
| LOG-06 | ron@hogwarts.com | 123 | Acceso no autorizado. Solicitar ingreso de datos válidos | "Usuario correcto, pero la contraseña es incorrecta." |
| LOG-07 | vyvs@mail.com | (vacío) | "Por favor, completa ambos campos." | igual |
| LOG-08 | vyvs@mail.com | hermione2025 | Acceso no autorizado. Solicitar ingreso de datos válidos | "El usuario no es correcto". |
| LOG-09 | vyvs@mail.com | 123 | Acceso no autorizado. Solicitar ingreso de datos válidos | "El usuario no es correcto". |
| LOG-10 | harry.com | (vacío) | "Por favor, completa ambos campos." | igual |
| LOG-11 | harry.com | hermione2025 | "Por favor, ingrese un correo electrónico válido." | igual |
| LOG-12 | harry.com | 123 | "Por favor, ingrese un correo electrónico válido." | igual |
| LOG-13 | ron@hogwarts.com ×3 intentos | 123 | "Atención, su cuenta está a punto de ser bloqueada." | "Usuario correcto, pero la contraseña es incorrecta." |

## Preferencias del alumno
- Respuestas concretas y breves, en español.
- Está aprendiendo Cucumber/Playwright desde cero: explicar el porqué de cada paso.
