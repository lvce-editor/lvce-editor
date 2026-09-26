import { describe, expect, test } from '@jest/globals'
import { execFile, spawn } from 'node:child_process'
import { access, chmod, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const testPosix = process.platform === 'win32' ? test.skip : test

const readTemplate = async (name: string) => {
  const url = new URL(`../src/parts/Template/template_${name}.txt`, import.meta.url)
  return readFile(url, 'utf8')
}

describe('linux cli templates', () => {
  test('runs the cli through Electron in Node mode', async () => {
    const launcher = await readTemplate('linux_cli')

    expect(launcher).toContain('ELECTRON_RUN_AS_NODE=1 exec')
    expect(launcher).toContain('"$APP_ROOT/bin/cli.js" "$@"')
  })

  testPosix('resolves the native executable when invoked through a symlink', async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-linux-cli-'))
    try {
      const appRoot = join(root, 'resources', 'app')
      const binPath = join(appRoot, 'bin')
      await mkdir(binPath, { recursive: true })
      const launcher = (await readTemplate('linux_cli')).replaceAll('@@APPLICATION_NAME@@', 'lvce')
      await writeFile(join(binPath, 'lvce'), launcher)
      await chmod(join(binPath, 'lvce'), 0o755)
      await writeFile(join(root, 'lvce'), '#!/bin/sh\nprintf "%s\\n" "$ELECTRON_RUN_AS_NODE|$*"\n')
      await chmod(join(root, 'lvce'), 0o755)
      const commandPath = join(root, 'command')
      await symlink(join(binPath, 'lvce'), commandPath)

      const { stdout } = await execFileAsync(commandPath, ['--version'])
      const realAppRoot = await realpath(appRoot)

      expect(stdout).toBe(`1|${join(realAppRoot, 'bin', 'cli.js')} --version\n`)
    } finally {
      await rm(root, { recursive: true })
    }
  })

  test('handles version without launching the Electron app', async () => {
    const cli = await readTemplate('linux_cli_js')

    expect(cli).toContain('if (isVersionRequest(args))')
    expect(cli).toContain("new URL('../package.json', import.meta.url)")
  })

  test('includes transient sessions in bash completions', async () => {
    const completion = await readTemplate('bash_completion')

    expect(completion).toContain('--transient')
    expect(completion).toContain('--electron-version')
  })

  test('prints the packaged version without Electron', async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-linux-cli-version-'))
    try {
      const binPath = join(root, 'bin')
      await mkdir(binPath)
      await writeFile(join(root, 'package.json'), JSON.stringify({ type: 'module', version: '1.2.3' }))
      await writeFile(join(binPath, 'cli.js'), await readTemplate('linux_cli_js'))

      const { stderr, stdout } = await execFileAsync(process.execPath, [join(binPath, 'cli.js'), '-v'])

      expect(stdout).toBe('1.2.3\n')
      expect(stderr).toBe('')
    } finally {
      await rm(root, { recursive: true })
    }
  })

  test('detaches Electron launches and ignores graphical output', async () => {
    const cli = await readTemplate('linux_cli_js')

    expect(cli).toContain('detached: true')
    expect(cli).toContain("stdio: foreground ? ['inherit', 'inherit', 'pipe'] : 'ignore'")
  })

  testPosix('launches transient sessions with isolated application state', async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-linux-cli-transient-'))
    const binPath = join(root, 'bin')
    const fakeElectronPath = join(root, 'fake-electron')
    const resultPath = join(root, 'result.json')
    let transientRoot = ''
    try {
      await mkdir(binPath)
      await writeFile(
        fakeElectronPath,
        `#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
writeFileSync(process.env.LVCE_TEST_RESULT, JSON.stringify({
  args: process.argv.slice(2),
  env: {
    XDG_CACHE_HOME: process.env.XDG_CACHE_HOME,
    XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME,
    XDG_DATA_HOME: process.env.XDG_DATA_HOME,
    XDG_STATE_HOME: process.env.XDG_STATE_HOME,
  },
}))
`,
      )
      await chmod(fakeElectronPath, 0o755)
      const cli = (await readTemplate('linux_cli_js'))
        .replaceAll('@@APPLICATION_NAME@@', 'lvce')
        .replace('spawn(executablePath, launchArgs, {', `spawn(${JSON.stringify(fakeElectronPath)}, launchArgs, {`)
      const cliPath = join(binPath, 'cli.js')
      await writeFile(cliPath, cli)

      const { stdout } = await execFileAsync(process.execPath, [cliPath, '--transient', '--wait'], {
        env: {
          ...process.env,
          LVCE_TEST_RESULT: resultPath,
          XDG_CACHE_HOME: '/existing/cache',
          XDG_CONFIG_HOME: '/existing/config',
          XDG_DATA_HOME: '/existing/data',
          XDG_STATE_HOME: '/existing/state',
        },
      })
      const result = JSON.parse(await readFile(resultPath, 'utf8'))
      transientRoot = dirname(result.env.XDG_CONFIG_HOME)
      const userDataDir = join(result.env.XDG_CONFIG_HOME, 'lvce', 'electron')

      expect(basename(result.env.XDG_CACHE_HOME)).toBe('cache')
      expect(basename(result.env.XDG_CONFIG_HOME)).toBe('config')
      expect(basename(result.env.XDG_DATA_HOME)).toBe('data')
      expect(basename(result.env.XDG_STATE_HOME)).toBe('state')
      expect(dirname(result.env.XDG_CACHE_HOME)).toBe(transientRoot)
      expect(dirname(result.env.XDG_DATA_HOME)).toBe(transientRoot)
      expect(dirname(result.env.XDG_STATE_HOME)).toBe(transientRoot)
      expect(result.args).toEqual(['--transient', '--wait', `--user-data-dir=${userDataDir}`])
      expect(stdout).toBe(
        `State is temporarily stored. Relaunch this state with: XDG_CONFIG_HOME='${result.env.XDG_CONFIG_HOME}' XDG_DATA_HOME='${result.env.XDG_DATA_HOME}' XDG_CACHE_HOME='${result.env.XDG_CACHE_HOME}' XDG_STATE_HOME='${result.env.XDG_STATE_HOME}' lvce --user-data-dir='${userDataDir}'\n`,
      )
    } finally {
      if (transientRoot) {
        await rm(transientRoot, { recursive: true })
      }
      await rm(root, { recursive: true })
    }
  })

  testPosix('forwards SIGINT to the foreground Electron process', async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-linux-cli-sigint-'))
    const binPath = join(root, 'bin')
    const fakeElectronPath = join(root, 'fake-electron')
    let cliProcess: ReturnType<typeof spawn> | undefined
    let electronPid = 0
    try {
      await mkdir(binPath)
      await writeFile(
        fakeElectronPath,
        `#!/usr/bin/env node
process.on('SIGINT', () => {
  console.log('received SIGINT')
  process.exit(0)
})
console.log(\`ready \${process.pid}\`)
setInterval(() => {}, 1000)
`,
      )
      await chmod(fakeElectronPath, 0o755)
      const cli = (await readTemplate('linux_cli_js')).replace(
        'spawn(executablePath, launchArgs, {',
        `spawn(${JSON.stringify(fakeElectronPath)}, launchArgs, {`,
      )
      const cliPath = join(binPath, 'cli.js')
      await writeFile(cliPath, cli)

      const spawnedCliProcess = spawn(process.execPath, [cliPath, '--wait'], {
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      })
      cliProcess = spawnedCliProcess
      let stdout = ''
      await new Promise<void>((resolve) => {
        spawnedCliProcess.stdout!.on('data', (chunk) => {
          stdout += chunk
          const match = stdout.match(/ready (\d+)/)
          if (match) {
            electronPid = Number(match[1])
            resolve()
          }
        })
      })

      if (!spawnedCliProcess.pid) {
        throw new Error('Failed to start CLI process')
      }
      process.kill(-spawnedCliProcess.pid, 'SIGINT')
      const { code, signal } = await new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve) => {
        spawnedCliProcess.once('exit', (code, signal) => resolve({ code, signal }))
      })

      expect({ code, signal }).toEqual({ code: 0, signal: null })
      expect(stdout).toContain('received SIGINT')
    } finally {
      if (electronPid) {
        try {
          process.kill(electronPid, 'SIGKILL')
        } catch {}
      }
      if (cliProcess?.pid) {
        try {
          process.kill(-cliProcess.pid, 'SIGKILL')
        } catch {}
      }
      await rm(root, { recursive: true })
    }
  })

  test('uses promise resolvers for child process events', async () => {
    const cli = await readTemplate('linux_cli_js')

    expect(cli).toContain('Promise.withResolvers()')
    expect(cli).not.toContain('new Promise')
  })

  test('only filters structured Electron diagnostics for non-verbose cli commands', async () => {
    const cli = await readTemplate('linux_cli_js')

    expect(cli).toContain('const electronDiagnosticPattern = /^\\[\\d+:\\d+\\/\\d+\\.\\d+:(?:ERROR|WARNING):/')
    expect(cli).toContain('child.stderr.pipe(process.stderr)')
  })

  testPosix('downloads the requested Electron version and forwards app arguments', async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-linux-cli-electron-version-'))
    const binPath = join(root, 'bin')
    const mainProcessPath = join(root, 'packages', 'main-process')
    const artifactDir = join(root, 'electron-artifact')
    const fakeElectronPath =
      process.platform === 'darwin'
        ? join(artifactDir, 'Electron.app', 'Contents', 'MacOS', 'Electron')
        : join(artifactDir, 'electron')
    const downloadResultPath = join(root, 'download.json')
    const launchResultPath = join(root, 'launch.json')
    const cachePath = join(root, 'cache')
    try {
      await mkdir(binPath, { recursive: true })
      await mkdir(join(mainProcessPath, 'node_modules', '@electron', 'get'), { recursive: true })
      await mkdir(join(mainProcessPath, 'node_modules', '@electron-internal', 'extract-zip'), { recursive: true })
      await mkdir(dirname(fakeElectronPath), { recursive: true })
      await writeFile(join(mainProcessPath, 'package.json'), JSON.stringify({ type: 'module' }))
      await writeFile(
        join(mainProcessPath, 'node_modules', '@electron', 'get', 'package.json'),
        JSON.stringify({ main: 'index.cjs' }),
      )
      await writeFile(
        join(mainProcessPath, 'node_modules', '@electron', 'get', 'index.cjs'),
        `exports.downloadArtifact = async (options) => {
  const { appendFileSync } = require('node:fs')
  appendFileSync(process.env.LVCE_TEST_DOWNLOAD_RESULT, JSON.stringify(options) + '\\n')
  return process.env.LVCE_TEST_ELECTRON_ARTIFACT
}
`,
      )
      await writeFile(
        join(mainProcessPath, 'node_modules', '@electron-internal', 'extract-zip', 'package.json'),
        JSON.stringify({ main: 'index.cjs' }),
      )
      await writeFile(
        join(mainProcessPath, 'node_modules', '@electron-internal', 'extract-zip', 'index.cjs'),
        `const { cpSync } = require('node:fs')
module.exports = async (_zipPath, { dir }) => {
  if (process.env.LVCE_TEST_FAIL_EXTRACTION) throw new Error('fixture extraction failed')
  cpSync(process.env.LVCE_TEST_ELECTRON_ARTIFACT_DIR, dir, { recursive: true })
}
`,
      )
      await writeFile(
        fakeElectronPath,
        `#!/usr/bin/env node
const { writeFileSync } = require('node:fs')
writeFileSync(process.env.LVCE_TEST_LAUNCH_RESULT, JSON.stringify({ args: process.argv.slice(2), runAsNode: process.env.ELECTRON_RUN_AS_NODE }))
`,
      )
      await chmod(fakeElectronPath, 0o755)
      const cliPath = join(binPath, 'cli.js')
      await writeFile(cliPath, (await readTemplate('linux_cli_js')).replaceAll('@@APPLICATION_NAME@@', 'lvce'))

      const env = {
        ...process.env,
        ELECTRON_RUN_AS_NODE: '1',
        LVCE_TEST_DOWNLOAD_RESULT: downloadResultPath,
        LVCE_TEST_ELECTRON_ARTIFACT: fakeElectronPath,
        LVCE_TEST_ELECTRON_ARTIFACT_DIR: artifactDir,
        LVCE_TEST_LAUNCH_RESULT: launchResultPath,
        XDG_CACHE_HOME: cachePath,
      }
      const { stderr } = await execFileAsync(process.execPath, [cliPath, '--electron-version', '44.1.2', '--wait'], { env })
      const download = JSON.parse((await readFile(downloadResultPath, 'utf8')).trim())
      const launch = JSON.parse(await readFile(launchResultPath, 'utf8'))
      const realAppRoot = await realpath(root)

      expect(download).toMatchObject({ version: '44.1.2', platform: process.platform, artifactName: 'electron' })
      expect(launch.args).toEqual([realAppRoot, '--wait'])
      expect(launch.runAsNode).toBeUndefined()
      expect(stderr).toBe('')
      const cachedExecutablePath =
        process.platform === 'darwin'
          ? join(cachePath, 'lvce', 'electron', `44.1.2-${process.platform}-${process.arch}`, 'Electron.app', 'Contents', 'MacOS', 'Electron')
          : join(cachePath, 'lvce', 'electron', `44.1.2-${process.platform}-${process.arch}`, 'electron')
      await expect(access(cachedExecutablePath, constants.X_OK)).resolves.toBeUndefined()

      await execFileAsync(process.execPath, [cliPath, '--electron-version=44.1.2', '--wait'], { env })
      expect((await readFile(downloadResultPath, 'utf8')).trim().split('\n')).toHaveLength(1)

      await expect(
        execFileAsync(process.execPath, [cliPath, '--electron-version=45.0.0', '--wait'], {
          env: { ...env, LVCE_TEST_FAIL_EXTRACTION: '1' },
        }),
      ).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining('fixture extraction failed') })
      await expect(
        access(join(cachePath, 'lvce', 'electron', `45.0.0-${process.platform}-${process.arch}`, 'electron')),
      ).rejects.toMatchObject({ code: 'ENOENT' })
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  testPosix('rejects invalid Electron versions without launching', async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-linux-cli-invalid-electron-version-'))
    try {
      const cliPath = join(root, 'cli.js')
      await writeFile(cliPath, await readTemplate('linux_cli_js'))

      await expect(execFileAsync(process.execPath, [cliPath, '--electron-version', 'latest'])).rejects.toMatchObject({
        code: 1,
        stderr: expect.stringContaining('--electron-version requires a valid Electron version'),
      })
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
