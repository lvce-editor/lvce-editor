import { expect, test } from '@jest/globals'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { validateAsset, verifyDigest } from '../src/parts/WindowsStagedUpdate/WindowsStagedUpdate.ts'
import { activate, extract } from '../src/parts/WindowsUpdateScripts/WindowsUpdateScripts.ts'

test('only accepts the expected release asset and a SHA256 digest', () => {
  const asset = {
    browser_download_url: 'https://github.com/lvce-editor/lvce-editor/releases/download/v1.2.3/Lvce-Update-v1.2.3-x64.zip',
    digest: `sha256:${'a'.repeat(64)}`,
    name: 'Lvce-Update-v1.2.3-x64.zip',
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

const runPowerShell = (script: string, plan: string): Promise<unknown> =>
  promisify(execFile)('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64')], {
    env: { ...process.env, LVCE_UPDATE_PLAN: plan },
    timeout: 30000,
    windowsHide: true,
  })

const createArchive = String.raw`
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$plan = Get-Content -LiteralPath $env:LVCE_UPDATE_PLAN -Raw | ConvertFrom-Json
$zip = [IO.Compression.ZipFile]::Open($plan.archive, 'Create')
try {
  $entry = $zip.CreateEntry($plan.entry)
  $writer = New-Object IO.StreamWriter($entry.Open())
  try { $writer.Write('extension payload') } finally { $writer.Dispose() }
} finally { $zip.Dispose() }
`

windowsTest(
  'extracts extension paths longer than MAX_PATH and refuses an existing stage',
  async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-extract-'))
    const stage = join(root, 'app.stage-' + 'a'.repeat(32))
    const entry = `extensions/${'nested-directory-'.repeat(10)}/${'nested-directory-'.repeat(5)}/file.txt`
    const path = join(root, 'plan.json')
    try {
      await writeFile(path, JSON.stringify({ archive: join(root, 'update.zip'), entry, stage }))
      await runPowerShell(createArchive, path)
      await runPowerShell(extract, path)
      expect(join(stage, entry).length).toBeGreaterThan(260)
      expect(await readFile(join(stage, entry), 'utf8')).toBe('extension payload')
      await expect(runPowerShell(extract, path)).rejects.toThrow('Staging directory already exists')
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  },
  45000,
)

windowsTest(
  'extraction rejects parent traversal without writing outside the stage',
  async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-extract-'))
    const path = join(root, 'plan.json')
    try {
      await writeFile(path, JSON.stringify({ archive: join(root, 'update.zip'), entry: '../outside.txt', stage: join(root, 'stage') }))
      await runPowerShell(createArchive, path)
      await expect(runPowerShell(extract, path)).rejects.toThrow()
      expect(existsSync(join(root, 'outside.txt'))).toBe(false)
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  },
  45000,
)

windowsTest(
  'successful folder swap relaunches, waits for acknowledgment, and cleans backup',
  async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-swap-success-'))
    const install = join(root, 'app')
    const token = 'b'.repeat(32)
    const stage = `${install}.stage-${token}`
    const backup = `${install}.backup-${token}`
    const ready = join(root, 'ready')
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
      const source = `public class App { public static void Main() { System.IO.File.WriteAllText(${JSON.stringify(ready)}, ${JSON.stringify(token)}); System.Threading.Thread.Sleep(8000); } }`
      const compile = `Add-Type -TypeDefinition '${source.replaceAll("'", "''")}' -OutputAssembly '${join(stage, 'app.exe').replaceAll("'", "''")}' -OutputType ConsoleApplication`
      await promisify(execFile)(
        'powershell.exe',
        ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(compile, 'utf16le').toString('base64')],
        { windowsHide: true },
      )
      await writeFile(path, JSON.stringify({ backup, exe: 'app.exe', install, log, parentPid: 2147483647, ready, stage, token, version: '1.2.3' }))
      await promisify(execFile)(
        'powershell.exe',
        ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(activate, 'utf16le').toString('base64')],
        {
          env: { ...process.env, LVCE_UPDATE_PLAN: path },
          timeout: 30000,
          windowsHide: true,
        },
      )
      expect(existsSync(join(install, 'app.exe'))).toBe(true)
      expect(existsSync(backup)).toBe(false)
      expect(existsSync(stage)).toBe(false)
      expect(await readFile(log, 'utf8')).toContain('startup-confirmed')
      expect(await readFile(log, 'utf8')).toContain('complete')
    } catch (error) {
      throw new Error(await readFile(log, 'utf8').catch(() => String(error)))
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 3500))
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
