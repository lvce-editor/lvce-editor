import { afterAll, expect, jest, test } from '@jest/globals'
import { execFile } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const directory = mkdtempSync(join(tmpdir(), 'lvce-update-test-'))
jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.ts', () => ({
  getLogsDir: (): string => pathToFileURL(directory).href,
}))
const { exec } = await import('../src/parts/Exec/Exec.ts')
const UpdateLog = await import('../src/parts/UpdateLog/UpdateLog.ts')
const logPath = join(directory, 'log-updates.txt')
const waitForLog = async (text: string): Promise<string> => {
  for (let i = 0; i < 100; i++) {
    const content = readFileSync(logPath, 'utf8')
    if (content.includes(text)) {
      return content
    }
    await new Promise((resolve) => setTimeout(resolve, 30))
  }
  throw new Error(`Missing log entry: ${text}`)
}

afterAll(() => rmSync(directory, { force: true, recursive: true }))

test('detached execution resolves at launch, captures output, and records nonzero exit', async () => {
  await exec(pathToFileURL(process.execPath).href, ['-e', 'setTimeout(() => { console.log("installer-output"); process.exit(7) }, 300)'], {
    detached: true,
  })
  expect(readFileSync(logPath, 'utf8')).toContain('installation outcome is not yet known')
  const content = await waitForLog('code=7')
  expect(content).toContain('installer-output')
  expect(readFileSync(join(directory, 'log-shared-process.txt'), 'utf8')).toContain('code=7')
})

test('launch errors reject and are persisted without truncating previous entries', async () => {
  UpdateLog.write('Previous update attempt')
  await expect(exec(pathToFileURL(join(directory, 'missing.exe')).href, [], { detached: true })).rejects.toThrow()
  const content = readFileSync(logPath, 'utf8')
  expect(content).toContain('Installer launch failed:')
  expect(content).toContain('Previous update attempt')
})

test('non-detached execution still waits and propagates a failing exit', async () => {
  await expect(exec(pathToFileURL(process.execPath).href, ['-e', 'process.exit(5)'])).rejects.toThrow()
})

test('non-file URLs cannot launch an executable', async () => {
  await expect(exec('https://example.com/installer.exe', [], { detached: true })).rejects.toThrow()
})

test('a detached installer survives the process that launched it', async () => {
  const marker = join(directory, 'installer completed.txt')
  const moduleUrl = new URL('../src/parts/Exec/Exec.ts', import.meta.url).href
  const script = `
    import { exec } from ${JSON.stringify(moduleUrl)};
    const childScript = 'const parentPid = ' + process.pid + '; const timer = setInterval(() => { try { process.kill(parentPid, 0) } catch { clearInterval(timer); require("node:fs").writeFileSync(' + JSON.stringify(${JSON.stringify(marker)}) + ', "completed after parent exit") } }, 30); setTimeout(() => process.exit(1), 4000).unref();';
    await exec(${JSON.stringify(pathToFileURL(process.execPath).href)}, ['-e', childScript], { detached: true });
  `
  await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], {
    env: { ...process.env, LOCALAPPDATA: directory, XDG_STATE_HOME: directory },
    timeout: 5000,
    windowsHide: true,
  })
  for (let i = 0; i < 100 && !existsSync(marker); i++) {
    await new Promise((resolve) => setTimeout(resolve, 30))
  }
  expect(readFileSync(marker, 'utf8')).toBe('completed after parent exit')
})
