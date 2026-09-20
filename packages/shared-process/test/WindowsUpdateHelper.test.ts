import { expect, test } from '@jest/globals'
import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

const windowsTest = process.platform === 'win32' ? test : test.skip

windowsTest(
  'PowerShell helper executes, writes independent logs, and survives its launching process',
  async () => {
    const directory = await mkdtemp(join(tmpdir(), 'lvce-helper-'))
    const path = join(directory, 'plan.json')
    const marker = join(directory, 'ready')
    const log = join(directory, 'phases.log')
    const moduleUrl = new URL('../src/parts/WindowsUpdateHelper/WindowsUpdateHelper.ts', import.meta.url).href
    const helper = String.raw`
$ErrorActionPreference = 'Stop'
$plan = Get-Content -LiteralPath $env:LVCE_UPDATE_PLAN -Raw | ConvertFrom-Json
[IO.File]::AppendAllText($plan.log, 'helper started')
$deadline = [DateTime]::UtcNow.AddSeconds(10)
while (Get-Process -Id $plan.parentPid -ErrorAction SilentlyContinue) {
  if ([DateTime]::UtcNow -gt $deadline) { throw 'Parent did not exit' }
  Start-Sleep -Milliseconds 50
}
Write-Output 'helper output after parent exit'
[IO.File]::WriteAllText($plan.marker, 'completed after parent exit')
`
    const script = `
    import { launch } from ${JSON.stringify(moduleUrl)};
    import { writeFile } from 'node:fs/promises';
    await writeFile(${JSON.stringify(path)}, JSON.stringify({ parentPid: process.pid, log: ${JSON.stringify(log)}, marker: ${JSON.stringify(marker)} }));
    await launch(${JSON.stringify(helper)}, ${JSON.stringify(path)}, ${JSON.stringify(directory)});
  `
    try {
      await writeFile(log, 'previous entry\n')
      await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { timeout: 15000, windowsHide: true })
      for (let i = 0; i < 150 && !existsSync(marker); i++) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      expect(await readFile(marker, 'utf8')).toBe('completed after parent exit')
      expect(await readFile(log, 'utf8')).toBe('previous entry\nhelper started')
      expect(await readFile(`${path}.output.log`, 'utf8')).toContain('helper output after parent exit')
    } catch (error) {
      throw new Error(`${error}\n${await readFile(log, 'utf8').catch(() => '')}\n${await readFile(`${path}.output.log`, 'utf8').catch(() => '')}`)
    } finally {
      await rm(directory, { force: true, maxRetries: 10, recursive: true, retryDelay: 100 })
    }
  },
  35000,
)
