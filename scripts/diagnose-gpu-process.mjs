#!/usr/bin/env node

import { collectDiagnostics, parseArguments, runComparison, writeReport } from './diagnose-gpu-process-lib.mjs'

const help = `GPU process diagnostics for Electron applications

Collect existing GPU processes:
  node scripts/diagnose-gpu-process.mjs \\
    --gpu-process code:1234 --cdp code:9222 \\
    --gpu-process lvce:5678 --cdp lvce:9223 \\
    --output /tmp/gpu-report.json

Run an isolated Code/LVCE comparison:
  node scripts/diagnose-gpu-process.mjs --compare \\
    --code /usr/share/code/code --lvce /usr/bin/lvce \\
    --output /tmp/gpu-comparison.json

Options:
  --gpu-process <label>:<pid>       Repeatable existing GPU process
  --cdp <label>:<port>              Optional matching CDP browser endpoint
  --compare                         Launch clean-profile comparison instances
  --code <path>                     Code executable (default: code)
  --lvce <path>                     LVCE executable (default: lvce)
  --ozone-platform <wayland|x11>    Default: wayland when WAYLAND_DISPLAY is set
  --idle-ms <milliseconds>          Idle delay before samples (default: 5000)
  --samples <count>                 Samples per variant (default: 3)
  --sample-interval-ms <ms>         Delay between samples (default: 1000)
  --output <path>                   Write JSON report instead of stdout
  --help                            Show this help
`

const mb = (kilobytes) => (Number.isFinite(kilobytes) ? `${(kilobytes / 1024).toFixed(1)} MB` : 'unavailable')

const printSummary = (report) => {
  if (report.variants) {
    for (const entry of report.variants) {
      const codeMemory = entry.measurements.code.medianMemory
      const lvceMemory = entry.measurements.lvce.medianMemory
      const codePrivateKb = (codeMemory.privateCleanKb || 0) + (codeMemory.privateDirtyKb || 0)
      const lvcePrivateKb = (lvceMemory.privateCleanKb || 0) + (lvceMemory.privateDirtyKb || 0)
      process.stdout.write(
        `${entry.variant}: Code RSS ${mb(codeMemory.rssKb)}, PSS ${mb(codeMemory.pssKb)}, private ${mb(codePrivateKb)}; LVCE RSS ${mb(lvceMemory.rssKb)}, PSS ${mb(lvceMemory.pssKb)}, private ${mb(lvcePrivateKb)}\n`,
      )
    }
    process.stdout.write(`${report.acceptance.passed ? 'GREEN' : 'RED'}: ${report.acceptance.requirement}\n`)
    return
  }
  for (const processDiagnostics of report.processes) {
    process.stdout.write(
      `${processDiagnostics.label} (${processDiagnostics.pid}): RSS ${mb(processDiagnostics.memory?.rssKb)}, PSS ${mb(processDiagnostics.memory?.pssKb)}, private ${mb((processDiagnostics.memory?.privateCleanKb || 0) + (processDiagnostics.memory?.privateDirtyKb || 0))}\n`,
    )
  }
}

const main = async () => {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) {
    process.stdout.write(help)
    return
  }
  if (options.compare && options.gpuProcesses.length) {
    throw new Error('--compare cannot be combined with --gpu-process')
  }
  if (!options.compare && !options.gpuProcesses.length) {
    throw new Error('Provide at least one --gpu-process or use --compare')
  }
  const report = options.compare
    ? await runComparison(options)
    : await collectDiagnostics({ cdpEndpoints: options.cdpEndpoints, gpuProcesses: options.gpuProcesses })
  const output = await writeReport(report, options.output)
  if (output) {
    process.stdout.write(`Wrote ${output}\n`)
    printSummary(report)
  }
  if (report.acceptance && !report.acceptance.passed) {
    process.exitCode = 1
  }
}

try {
  await main()
} catch (error) {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
}
