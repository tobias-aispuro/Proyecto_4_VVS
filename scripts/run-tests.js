const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const projectDirectory = path.resolve(__dirname, '..');
const reportsDirectory = path.join(projectDirectory, 'reports');
const cucumberReportPath = path.join(reportsDirectory, 'cucumber-report.json');
const markdownReportPath = path.join(projectDirectory, 'reporte.md');
const cucumberPackagePath = require.resolve('@cucumber/cucumber/package.json');
const cucumberCliPath = path.join(path.dirname(cucumberPackagePath), 'bin', 'cucumber.js');

function getScenarioStatus(scenario) {
  const statuses = (scenario.steps || []).map((step) =>
    String((step.result || {}).status || '').toLowerCase()
  );

  if (statuses.some((status) => ['failed', 'undefined', 'ambiguous', 'pending', 'unknown'].includes(status))) {
    return 'fallido';
  }

  if (statuses.length > 0 && statuses.every((status) => status === 'passed')) {
    return 'pasó';
  }

  if (statuses.length > 0 && statuses.every((status) => ['passed', 'skipped'].includes(status))) {
    return 'no ejecutado';
  }

  return 'fallido';
}

function getScenarioId(scenario) {
  const match = (scenario.name || '').match(/LOG-\d+/);
  return match ? match[0] : 'Sin ID';
}

function getFailureDetails(scenario) {
  const failedStep = (scenario.steps || []).find((step) =>
    ['failed', 'undefined', 'ambiguous', 'pending', 'unknown'].includes(
      String((step.result || {}).status || '').toLowerCase()
    )
  );
  const stepText = failedStep && failedStep.name ? failedStep.name : 'No se pudo completar la prueba.';
  const errorMessage = failedStep && failedStep.result ? failedStep.result.error_message || '' : '';
  const expectedFromError = errorMessage.match(/Expected(?: string)?:\s*"([^"]*)"/);
  const expectedFromStep = stepText.match(/"([^"]*)"/);
  const expected = expectedFromError
    ? expectedFromError[1]
    : expectedFromStep
      ? expectedFromStep[1]
      : '';
  const received = errorMessage.match(/Received(?: string)?:\s*"([^"]*)"/);

  let observed = 'No se obtuvo el resultado esperado.';
  if (received) {
    observed = received[1]
      ? `El sistema mostró “${received[1]}”.`
      : 'El sistema dejó vacío el mensaje esperado.';
  }

  return { stepText, expected, observed };
}

function markdownEscape(text) {
  return String(text || '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function renderReport(scenarios) {
  const passed = scenarios.filter((scenario) => scenario.status === 'pasó');
  const failed = scenarios.filter((scenario) => scenario.status === 'fallido');
  const notRun = scenarios.filter((scenario) => scenario.status === 'no ejecutado');
  const lines = [
    '# Reporte de errores identificados — Login',
    '',
    `**Fecha de ejecución:** ${new Date().toISOString()}`,
    '',
    '## Resumen',
    '',
    `- **Casos ejecutados:** ${scenarios.length}`,
    `- **Pasaron:** ${passed.length}`,
    `- **Fallaron:** ${failed.length}`,
    `- **No ejecutados:** ${notRun.length}`,
    '',
    '## Resultado por caso',
    '',
    '| ID | Caso | Resultado |',
    '| --- | --- | --- |',
    ...scenarios.map(
      (scenario) =>
        `| ${markdownEscape(getScenarioId(scenario))} | ${markdownEscape(scenario.name || 'Sin nombre')} | ${scenario.status} |`
    ),
    '',
    '## Errores identificados',
    '',
  ];

  if (failed.length === 0) {
    lines.push(
      scenarios.length > 0 ? 'No se detectaron casos fallidos.' : 'No se ejecutaron casos de prueba.'
    );
  } else {
    for (const scenario of failed) {
      const details = getFailureDetails(scenario);
      lines.push(
        `### ${getScenarioId(scenario)} — ${markdownEscape(scenario.name || 'Caso sin nombre')}`,
        '',
        `- **Paso que no se cumplió:** ${markdownEscape(details.stepText)}`,
        details.expected ? `- **Resultado esperado:** ${markdownEscape(details.expected)}` : '',
        `- **Resultado observado:** ${markdownEscape(details.observed)}`,
        ''
      );
    }
  }

  return lines.join('\n') + '\n';
}

function printSummary(scenarios) {
  const passed = scenarios.filter((scenario) => scenario.status === 'pasó');
  const failed = scenarios.filter((scenario) => scenario.status === 'fallido');
  const notRun = scenarios.filter((scenario) => scenario.status === 'no ejecutado');
  const ids = (items) => items.map(getScenarioId).join(', ') || 'ninguno';

  console.log('Resultado de las pruebas de Login');
  console.log(
    `Total: ${scenarios.length} | Pasaron: ${passed.length} | Fallaron: ${failed.length} | No ejecutados: ${notRun.length}`
  );
  console.log(`Pasaron: ${ids(passed)}`);

  if (failed.length > 0) {
    console.log('Fallaron:');
    for (const scenario of failed) {
      const details = getFailureDetails(scenario);
      const expected = details.expected ? ` Se esperaba: “${details.expected}”.` : '';
      console.log(`- ${getScenarioId(scenario)}.${expected} ${details.observed}`);
    }
  }

  if (notRun.length > 0) {
    console.log(`No ejecutados: ${ids(notRun)}`);
  }

  const brief =
    scenarios.length === 0
      ? 'No se ejecutaron pruebas; revisá la configuración e intentá nuevamente.'
      : failed.length > 0
        ? `${failed.length} ${failed.length === 1 ? 'caso requiere' : 'casos requieren'} revisión.`
        : 'Todos los casos ejecutados pasaron.';
  console.log(`Resumen: ${passed.length} de ${scenarios.length} casos pasaron; ${brief}`);
}

fs.mkdirSync(reportsDirectory, { recursive: true });
if (fs.existsSync(cucumberReportPath)) {
  fs.unlinkSync(cucumberReportPath);
}

const run = spawnSync(
  process.execPath,
  [
    cucumberCliPath,
    '--format',
    `json:${path.relative(projectDirectory, cucumberReportPath).split(path.sep).join('/')}`,
  ],
  {
    cwd: projectDirectory,
    env: process.env,
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe'],
  }
);

if (run.error) {
  console.error(`No se pudieron iniciar las pruebas: ${run.error.message}`);
  process.exit(1);
}

if (!fs.existsSync(cucumberReportPath)) {
  const details = run.stderr && run.stderr.trim().split(/\r?\n/, 1)[0];
  console.error('No se pudo generar el resultado de las pruebas.');
  if (details) {
    console.error(details);
  }
  process.exit(run.status === 0 ? 1 : run.status || 1);
}

let features;
try {
  features = JSON.parse(fs.readFileSync(cucumberReportPath, 'utf8'));
} catch (error) {
  console.error(`No se pudo leer el resultado de las pruebas: ${error.message}`);
  process.exit(1);
}

const scenarios = (Array.isArray(features) ? features : [])
  .flatMap((feature) => feature.elements || [])
  .filter((element) => element.type === 'scenario')
  .map((scenario) => ({ ...scenario, status: getScenarioStatus(scenario) }))
  .sort((first, second) => {
    const firstId = Number((getScenarioId(first).match(/\d+/) || [0])[0]);
    const secondId = Number((getScenarioId(second).match(/\d+/) || [0])[0]);
    return firstId - secondId;
  });

fs.writeFileSync(markdownReportPath, renderReport(scenarios), 'utf8');
printSummary(scenarios);

process.exit(
  scenarios.length > 0 && run.status === 0 && scenarios.every((scenario) => scenario.status === 'pasó')
    ? 0
    : 1
);
