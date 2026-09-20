import { expect, test } from '@jest/globals'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { validateAsset, verifyDigest } from '../src/parts/WindowsStagedUpdate/WindowsStagedUpdate.ts'
import * as WindowsUpdateHelper from '../src/parts/WindowsUpdateHelper/WindowsUpdateHelper.ts'
import { activate } from '../src/parts/WindowsUpdateScripts/WindowsUpdateScripts.ts'

test('only accepts the expected release asset and a SHA256 digest', () => {
  const asset = {
    browser_download_url: 'https://github.com/lvce-editor/lvce-editor/releases/download/v1.2.3/Lvce-Setup-v1.2.3-x64.exe',
    digest: `sha256:${'a'.repeat(64)}`,
    name: 'Lvce-Setup-v1.2.3-x64.exe',
  }
  expect(() => validateAsset(asset, '1.2.3', 'x64')).not.toThrow()
  expect(() => validateAsset({ ...asset, digest: '' }, '1.2.3', 'x64')).toThrow('SHA256')
  expect(() => validateAsset({ ...asset, browser_download_url: 'https://example.com/update.zip' }, '1.2.3', 'x64')).toThrow('Unexpected')
  expect(() => validateAsset(asset, '../escape', 'x64')).toThrow('Unsupported')
})

test('rejects corrupted downloaded payloads', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lvce-digest-'))
  try {
    const path = join(directory, 'payload.zip')
    await writeFile(path, 'payload')
    const digest = `sha256:${createHash('sha256').update('payload').digest('hex')}`
    await expect(verifyDigest(path, digest)).resolves.toBeUndefined()
    await writeFile(path, 'corrupted')
    await expect(verifyDigest(path, digest)).rejects.toThrow('checksum mismatch')
  } finally {
    await rm(directory, { force: true, recursive: true })
  }
})

const windowsTest = process.platform === 'win32' ? test : test.skip

windowsTest.each([false, true])(
  'successful folder swap waits for the real editor and cleans backup (launcher handoff: %s)',
  async (handoff) => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-swap-success-'))
    const install = join(root, 'app')
    const token = 'b'.repeat(32)
    const stage = `${install}.stage-${token}`
    const backup = `${install}.backup-${token}`
    const ready = join(root, 'ready')
    const stop = join(root, 'stop')
    const path = join(root, 'plan.json')
    const log = join(root, 'log.txt')
    try {
      await mkdir(install)
      await writeFile(join(install, 'old-content'), 'old')
      const oldNested = join(install, 'extension', 'nested-directory-'.repeat(10), 'nested-directory-'.repeat(5))
      await mkdir(oldNested, { recursive: true })
      await writeFile(join(oldNested, 'long-path.txt'), 'old extension')
      await mkdir(join(stage, 'resources', 'app'), { recursive: true })
      await writeFile(join(stage, 'resources', 'app', 'config.json'), JSON.stringify({ version: '1.2.3' }))
      const acknowledgment = JSON.stringify({ token, version: '1.2.3' }).slice(0, -1) + ',"pid":'
      const source = `public class App { public static void Main(string[] args) {
        bool handoff = ${handoff};
        if (handoff && (args.Length == 0 || args[0] != "--child")) {
          System.Diagnostics.Process.Start(System.Diagnostics.Process.GetCurrentProcess().MainModule.FileName, "--child");
          return;
        }
        System.Threading.Thread.Sleep(700);
        System.IO.File.WriteAllText(${JSON.stringify(`${ready}.tmp`)}, ${JSON.stringify(acknowledgment)} + System.Diagnostics.Process.GetCurrentProcess().Id + "}");
        System.IO.File.Move(${JSON.stringify(`${ready}.tmp`)}, ${JSON.stringify(ready)});
        while (!System.IO.File.Exists(${JSON.stringify(stop)})) {
          System.Threading.Thread.Sleep(100);
        }
      } }`
      const compile = `Add-Type -TypeDefinition '${source.replaceAll("'", "''")}' -OutputAssembly '${join(stage, 'app.exe').replaceAll("'", "''")}' -OutputType ConsoleApplication`
      await promisify(execFile)(
        'powershell.exe',
        ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(compile, 'utf16le').toString('base64')],
        { windowsHide: true },
      )
      await writeFile(path, JSON.stringify({ backup, exe: 'app.exe', install, log, parentPid: 2147483647, ready, stage, token, version: '1.2.3' }))
      const helperPid = await WindowsUpdateHelper.launch(activate, path, root)
      const deadline = Date.now() + 30000
      while (WindowsUpdateHelper.isRunning(helperPid)) {
        if (Date.now() > deadline) {
          throw new Error('Update helper did not finish')
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      expect(existsSync(join(install, 'app.exe'))).toBe(true)
      expect(existsSync(backup)).toBe(false)
      expect(existsSync(stage)).toBe(false)
      expect(await readFile(log, 'utf8')).toContain('startup-confirmed')
      expect(await readFile(log, 'utf8')).toContain('complete')
    } catch (error) {
      throw new Error(await readFile(log, 'utf8').catch(() => String(error)))
    } finally {
      await writeFile(stop, '')
      await rm(root, { force: true, maxRetries: 5, recursive: true, retryDelay: 200 })
    }
  },
  45000,
)

windowsTest(
  'failed new-app launch restores the complete old installation',
  async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-swap-'))
    const install = join(root, 'app')
    const token = 'a'.repeat(32)
    const stage = `${install}.stage-${token}`
    const backup = `${install}.backup-${token}`
    try {
      await mkdir(install)
      await writeFile(join(install, 'old-content'), 'preserved')
      await mkdir(join(stage, 'resources', 'app'), { recursive: true })
      await writeFile(join(stage, 'resources', 'app', 'config.json'), JSON.stringify({ version: '1.2.3' }))
      const path = join(root, 'plan.json')
      const log = join(root, 'log.txt')
      await writeFile(
        path,
        JSON.stringify({
          backup,
          exe: 'missing.exe',
          install,
          log,
          parentPid: 2147483647,
          ready: join(root, 'ready'),
          stage,
          token,
          version: '1.2.3',
        }),
      )
      await expect(
        promisify(execFile)(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(activate, 'utf16le').toString('base64')],
          {
            env: { ...process.env, LVCE_UPDATE_PLAN: path },
            timeout: 30000,
            windowsHide: true,
          },
        ),
      ).rejects.toThrow()
      expect(await readFile(join(install, 'old-content'), 'utf8')).toBe('preserved')
      expect(existsSync(backup)).toBe(false)
      expect(existsSync(stage)).toBe(true)
      expect(await readFile(log, 'utf8')).toContain('rolled-back')
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  },
  40000,
)

windowsTest(
  'helper rejects an out-of-tree staging directory without modifying installation',
  async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-swap-'))
    try {
      const install = join(root, 'app')
      await mkdir(install)
      const path = join(root, 'plan.json')
      await writeFile(path, JSON.stringify({ backup: `${install}.backup`, install, stage: join(root, 'outside', 'stage'), token: 'a'.repeat(32) }))
      await expect(
        promisify(execFile)(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(activate, 'utf16le').toString('base64')],
          {
            env: { ...process.env, LVCE_UPDATE_PLAN: path },
            timeout: 10000,
            windowsHide: true,
          },
        ),
      ).rejects.toThrow()
      expect(existsSync(install)).toBe(true)
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  },
  15000,
)
