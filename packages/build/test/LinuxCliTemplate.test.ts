import { describe, expect, test } from '@jest/globals'
import { execFile, spawn } from 'node:child_process'
import { access, chmod, lstat, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, delimiter, dirname, join } from 'node:path'
import { promisify } from 'node:util'
import { setTimeout } from 'node:timers/promises'

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
    expect(completion).toContain('--asar')
    expect(completion).toContain('--electron-version')
  })

  test('includes the ASAR launch flag in CLI help', async () => {
    const help = await readFile(new URL('../../shared-process/src/parts/GetHelpString/GetHelpString.ts', import.meta.url), 'utf8')

    expect(help).toContain('--asar')
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

  testPosix('loads argv.json before explicit CLI arguments and forwards configured links', async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-linux-cli-argv-config-'))
    const binPath = join(root, 'bin')
    const serverSourcePath = join(root, 'packages', 'server', 'src')
    const configPath = join(root, '.config', 'lvce-oss', 'argv.json')
    const resultPath = join(root, 'result.json')
    const fakeElectronPath = join(root, 'fake-electron')
    try {
      await mkdir(binPath, { recursive: true })
      await mkdir(serverSourcePath, { recursive: true })
      await mkdir(dirname(configPath), { recursive: true })
      await writeFile(
        join(serverSourcePath, 'argvConfig.js'),
        `import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
export const getArgvConfigPath = (env) => join(env.XDG_CONFIG_HOME, 'lvce-oss', 'argv.json')
export const load = async (path) => {
  const config = JSON.parse(await readFile(path, 'utf8'))
  return Object.entries(config).flatMap(([key, value]) => Array.isArray(value) ? value.map((item) => '--' + key + '=' + item) : ['--' + key + '=' + value])
}
`,
      )
      await writeFile(configPath, `{
  "link": ["/extensions/first", "/extensions/with spaces"],
  "theme": "configured"
}`)
      await writeFile(
        fakeElectronPath,
        `#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
writeFileSync(process.env.LVCE_TEST_RESULT, JSON.stringify({ args: process.argv.slice(2), loaded: process.env.LVCE_ARGV_CONFIG_LOADED }))
`,
      )
      await chmod(fakeElectronPath, 0o755)
      const cli = (await readTemplate('linux_cli_js'))
        .replaceAll('@@APPLICATION_NAME@@', 'lvce')
        .replace('spawn(executablePath, launchArgs, {', `spawn(${JSON.stringify(fakeElectronPath)}, launchArgs, {`)
      const cliPath = join(binPath, 'cli.js')
      await writeFile(cliPath, cli)

      await execFileAsync(process.execPath, [cliPath, '--wait', '--theme=explicit', '/workspace/with spaces'], {
        env: {
          ...process.env,
          LVCE_TEST_RESULT: resultPath,
          XDG_CONFIG_HOME: join(root, '.config'),
        },
      })
      const result = JSON.parse(await readFile(resultPath, 'utf8'))

      expect(result.args).toEqual([
        '--link=/extensions/first',
        '--link=/extensions/with spaces',
        '--theme=configured',
        '--wait',
        '--theme=explicit',
        '/workspace/with spaces',
      ])
      expect(result.loaded).toBe('1')
    } finally {
      await rm(root, { recursive: true, force: true })
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

  testPosix('waits for CPU profiles and forwards output and exit status', async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-linux-cli-cpu-profile-'))
    const binPath = join(root, 'bin')
    const fakeElectronPath = join(root, 'fake-electron')
    try {
      await mkdir(binPath)
      await writeFile(
        fakeElectronPath,
        `#!/usr/bin/env node
setTimeout(() => {
  console.log('profile written to /tmp/profile.cpuprofile')
  process.stderr.write('profile complete\\n')
  process.exit(Number(process.env.LVCE_TEST_EXIT_CODE || 0))
}, 100)
`,
      )
      await chmod(fakeElectronPath, 0o755)
      const cli = (await readTemplate('linux_cli_js')).replace(
        'spawn(executablePath, launchArgs, {',
        `spawn(${JSON.stringify(fakeElectronPath)}, launchArgs, {`,
      )
      const cliPath = join(binPath, 'cli.js')
      await writeFile(cliPath, cli)

      for (const flag of ['--cpu-profile', '--wait']) {
        const success = await execFileAsync(process.execPath, [cliPath, flag])
        expect(success.stdout).toBe('profile written to /tmp/profile.cpuprofile\n')
        expect(success.stderr).toBe('profile complete\n')

        await expect(
          execFileAsync(process.execPath, [cliPath, flag], {
            env: { ...process.env, LVCE_TEST_EXIT_CODE: '7' },
          }),
        ).rejects.toMatchObject({
          code: 7,
          stdout: 'profile written to /tmp/profile.cpuprofile\n',
          stderr: 'profile complete\n',
        })
      }
    } finally {
      await rm(root, { recursive: true, force: true })
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
    const toolsPath = join(root, 'tools')
    const mainProcessPath = join(root, 'packages', 'main-process')
    const serverSourcePath = join(root, 'packages', 'server', 'src')
    const artifactDir = join(root, 'electron-artifact')
    const fakeElectronPath =
      process.platform === 'darwin' ? join(artifactDir, 'Electron.app', 'Contents', 'MacOS', 'Electron') : join(artifactDir, 'electron')
    const fakeSandboxPath = join(artifactDir, 'chrome-sandbox')
    const downloadResultPath = join(root, 'download.json')
    const launchResultPath = join(root, 'launch.json')
    const cachePath = join(dirname(root), `${basename(root)}-cache`)
    const fakeNpxPath = join(toolsPath, 'npx')
    const packResultPath = join(root, 'pack.jsonl')
    const failingSudoPath = join(root, 'sudo')
    try {
      await mkdir(binPath, { recursive: true })
      await mkdir(toolsPath, { recursive: true })
      await mkdir(serverSourcePath, { recursive: true })
      await mkdir(join(mainProcessPath, 'node_modules', '@electron', 'get'), { recursive: true })
      await mkdir(join(mainProcessPath, 'node_modules', '@electron-internal', 'extract-zip'), { recursive: true })
      await mkdir(join(root, 'static', 'build-a'), { recursive: true })
      await mkdir(dirname(fakeElectronPath), { recursive: true })
      await writeFile(join(root, 'package.json'), JSON.stringify({ type: 'module', version: '1.2.3' }))
      await writeFile(join(root, 'static', 'build-a', 'index.html'), 'app entry')
      await writeFile(fakeNpxPath, [
        '#!/bin/sh',
        'printf "%s\\n" "$5" >> "$LVCE_TEST_PACK_RESULT"',
        'mkdir -p "$(dirname "$5")"',
        "printf 'packed' > \"$5\"",
        '',
      ].join('\n'))
      await chmod(fakeNpxPath, 0o755)
      await writeFile(fakeSandboxPath, 'fake sandbox helper')
      await chmod(fakeSandboxPath, 0o755)
      await writeFile(failingSudoPath, '#!/bin/sh\nexit 72\n')
      await chmod(failingSudoPath, 0o755)
      await writeFile(join(mainProcessPath, 'package.json'), JSON.stringify({ type: 'module' }))
      await writeFile(
        join(serverSourcePath, 'argvConfig.js'),
        `export const getArgvConfigPath = () => '/fixture/argv.json'
export const load = async () => ['--electron-version=44.1.2', '--asar', '--link=/extensions/from argv.json']
`,
      )
      await writeFile(join(mainProcessPath, 'node_modules', '@electron', 'get', 'package.json'), JSON.stringify({ main: 'index.cjs' }))
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
const { renameSync, writeFileSync } = require('node:fs')
const temporaryResult = process.env.LVCE_TEST_LAUNCH_RESULT + '.tmp'
writeFileSync(temporaryResult, JSON.stringify({ args: process.argv.slice(2), runAsNode: process.env.ELECTRON_RUN_AS_NODE }))
renameSync(temporaryResult, process.env.LVCE_TEST_LAUNCH_RESULT)
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
        LVCE_TEST_PACK_RESULT: packResultPath,
        PATH: `${toolsPath}${delimiter}${process.env.PATH}`,
        XDG_CACHE_HOME: cachePath,
      }
      const { stdout, stderr } = await execFileAsync(process.execPath, [cliPath, '--wait'], { env })
      const download = JSON.parse((await readFile(downloadResultPath, 'utf8')).trim())
      const launch = JSON.parse(await readFile(launchResultPath, 'utf8'))
      const realAppRoot = await realpath(root)

      expect(download).toMatchObject({ version: '44.1.2', platform: process.platform, artifactName: 'electron' })
      expect(launch.args[0]).toMatch(/app\.asar$/)
      expect(launch.args[0]).not.toBe(realAppRoot)
      expect(launch.args.slice(1)).toEqual(['--link=/extensions/from argv.json', '--wait'])
      expect(launch.runAsNode).toBeUndefined()
      expect(stdout).toContain('Downloading Electron 44.1.2...')
      expect(stdout).toContain('Creating ASAR application...')
      expect(stderr).toBe('')
      await rm(join(serverSourcePath, 'argvConfig.js'))
      const cachedExecutablePath =
        process.platform === 'darwin'
          ? join(cachePath, 'lvce', 'electron', `44.1.2-${process.platform}-${process.arch}`, 'Electron.app', 'Contents', 'MacOS', 'Electron')
          : join(cachePath, 'lvce', 'electron', `44.1.2-${process.platform}-${process.arch}`, 'electron')
      await expect(access(cachedExecutablePath, constants.X_OK)).resolves.toBeUndefined()

      if (process.platform === 'linux') {
        const cachedSandboxPath = join(dirname(cachedExecutablePath), 'chrome-sandbox')
        const userId = process.getuid?.()
        const groupId = process.getgid?.()
        if (userId === undefined || groupId === undefined) {
          throw new Error('POSIX user and group ids are required for the Linux sandbox test')
        }
        const preparedSandboxStats = await lstat(cachedSandboxPath)
        expect(preparedSandboxStats.uid).toBe(0)
        expect(preparedSandboxStats.mode & 0o7777).toBe(0o4755)

        const { stdout: cachedStdout } = await execFileAsync(process.execPath, [cliPath, '--electron-version=44.1.2', '--asar', '--wait'], {
          env: { ...env, PATH: `${root}:${process.env.PATH}` },
        })
        expect(cachedStdout).not.toContain('Downloading Electron')

        await execFileAsync('sudo', ['chown', `${userId}:${groupId}`, cachedSandboxPath])
        await chmod(cachedSandboxPath, 0o755)
        await execFileAsync(process.execPath, [cliPath, '--electron-version=44.1.2', '--wait'], { env })
        const repairedSandboxStats = await lstat(cachedSandboxPath)
        expect(repairedSandboxStats.uid).toBe(0)
        expect(repairedSandboxStats.mode & 0o7777).toBe(0o4755)

        await execFileAsync('sudo', ['chown', `${userId}:${groupId}`, cachedSandboxPath])
        await chmod(cachedSandboxPath, 0o755)
        await rm(launchResultPath)
        await expect(
          execFileAsync(process.execPath, [cliPath, '--electron-version=44.1.2', '--wait'], {
            env: { ...env, PATH: `${root}:${process.env.PATH}` },
          }),
        ).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining('Unable to prepare Electron sandbox helper') })
        await expect(access(launchResultPath)).rejects.toMatchObject({ code: 'ENOENT' })

        await rm(cachedSandboxPath)
        await symlink(fakeSandboxPath, cachedSandboxPath)
        await expect(execFileAsync(process.execPath, [cliPath, '--electron-version=44.1.2', '--wait'], { env })).rejects.toMatchObject({
          code: 1,
          stderr: expect.stringContaining('must be a regular file'),
        })
        await expect(access(launchResultPath)).rejects.toMatchObject({ code: 'ENOENT' })
      } else {
        const { stdout: cachedStdout } = await execFileAsync(process.execPath, [cliPath, '--electron-version=44.1.2', '--asar', '--wait'], { env })
        expect(cachedStdout).not.toContain('Downloading Electron')
      }
      expect((await readFile(downloadResultPath, 'utf8')).trim().split('\n')).toHaveLength(1)
      expect((await readFile(packResultPath, 'utf8')).trim().split('\n')).toHaveLength(1)

      const detachedResultPath = join(root, 'detached-launch.json')
      const { stdout: detachedStdout } = await execFileAsync(process.execPath, [cliPath, '--electron-version=44.2.0'], {
        env: { ...env, LVCE_TEST_LAUNCH_RESULT: detachedResultPath },
      })
      expect(detachedStdout).toContain('Downloading Electron 44.2.0...')
      // The CLI exits before its detached child. Wait for that child's write before removing its directory.
      let detachedResult: string | undefined
      for (let attempt = 0; attempt < 100; attempt++) {
        try {
          detachedResult = await readFile(detachedResultPath, 'utf8')
          if (detachedResult) break
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
        }
        await setTimeout(20)
      }
      expect(JSON.parse(detachedResult || 'null')).toEqual({ args: [realAppRoot] })

      await expect(
        execFileAsync(process.execPath, [cliPath, '--electron-version=45.0.0', '--wait'], {
          env: { ...env, LVCE_TEST_FAIL_EXTRACTION: '1' },
        }),
      ).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining('fixture extraction failed') })
      await expect(access(join(cachePath, 'lvce', 'electron', `45.0.0-${process.platform}-${process.arch}`, 'electron'))).rejects.toMatchObject({
        code: 'ENOENT',
      })
    } finally {
      await rm(root, { recursive: true, force: true })
      await rm(cachePath, { recursive: true, force: true })
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

  testPosix('packs and reuses an ASAR app while forwarding launch arguments', async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-linux-cli-asar-'))
    const binPath = join(root, 'bin')
    const fakeNpxPath = join(root, 'npx')
    const fakeElectronPath = join(root, 'fake-electron')
    const cliPath = join(binPath, 'cli.js')
    const resultPath = join(root, 'launch.json')
    const packResultPath = join(root, 'pack.jsonl')
    const cacheHome = join(dirname(root), `${basename(root)}-cache`)
    try {
      await mkdir(binPath, { recursive: true })
      await mkdir(join(root, 'static', 'build-a'), { recursive: true })
      await writeFile(join(root, 'package.json'), JSON.stringify({ type: 'module', version: '1.2.3' }))
      await writeFile(join(root, 'static', 'build-a', 'index.html'), 'app entry')
      await writeFile(fakeNpxPath, ['#!/bin/sh', 'printf "%s\\n" "$5" >> "$LVCE_TEST_PACK_RESULT"', 'mkdir -p "$(dirname "$5")"', "printf 'packed' > \"$5\"", ''].join('\n'))
      await chmod(fakeNpxPath, 0o755)
      await writeFile(fakeElectronPath, [
        '#!/usr/bin/env node',
        "import { writeFileSync } from 'node:fs'",
        'writeFileSync(process.env.LVCE_TEST_LAUNCH_RESULT, JSON.stringify(process.argv.slice(2)))',
        '',
      ].join('\n'))
      await chmod(fakeElectronPath, 0o755)
      const cli = (await readTemplate('linux_cli_js'))
        .replaceAll('@@APPLICATION_NAME@@', 'lvce')
        .replace('spawn(executablePath, launchArgs, {', `spawn(${JSON.stringify(fakeElectronPath)}, launchArgs, {`)
      await writeFile(cliPath, cli)

      const env = {
        ...process.env,
        LVCE_TEST_PACK_RESULT: packResultPath,
        LVCE_TEST_LAUNCH_RESULT: resultPath,
        PATH: `${root}${delimiter}${process.env.PATH}`,
        XDG_CACHE_HOME: cacheHome,
      }
      const first = await execFileAsync(process.execPath, [cliPath, '--asar', '--wait', 'file.txt'], { env })
      const firstArgs: string[] = JSON.parse(await readFile(resultPath, 'utf8'))
      const firstArchive = firstArgs[0]
      expect(firstArgs.slice(1)).toEqual(['--wait', 'file.txt'])
      expect(first.stdout).toContain('Creating ASAR application...')
      expect(await readFile(firstArchive, 'utf8')).toBe('packed')
      await expect(access(join(dirname(firstArchive), 'app'))).rejects.toMatchObject({ code: 'ENOENT' })

      await rm(resultPath)
      const second = await execFileAsync(process.execPath, [cliPath, '--asar', '--wait'], { env })
      const secondArgs: string[] = JSON.parse(await readFile(resultPath, 'utf8'))
      expect(secondArgs[0]).toBe(firstArchive)
      expect(secondArgs.slice(1)).toEqual(['--wait'])
      expect(second.stdout).not.toContain('Creating ASAR application...')
      expect((await readFile(packResultPath, 'utf8')).trim().split('\n')).toHaveLength(1)

      await mkdir(join(root, 'static', 'build-b'))
      await rm(resultPath)
      const third = await execFileAsync(process.execPath, [cliPath, '--asar', '--wait'], { env })
      const thirdArgs: string[] = JSON.parse(await readFile(resultPath, 'utf8'))
      expect(thirdArgs[0]).not.toBe(firstArchive)
      expect(third.stdout).toContain('Creating ASAR application...')
      expect((await readFile(packResultPath, 'utf8')).trim().split('\n')).toHaveLength(2)
    } finally {
      await rm(root, { recursive: true, force: true })
      await rm(cacheHome, { recursive: true, force: true })
    }
  })

  testPosix('does not reuse a failed ASAR pack and recovers on retry', async () => {
    const root = await mkdtemp(join(tmpdir(), 'lvce-linux-cli-asar-failure-'))
    const binPath = join(root, 'bin')
    const fakeNpxPath = join(root, 'npx')
    const fakeElectronPath = join(root, 'fake-electron')
    const cliPath = join(binPath, 'cli.js')
    const resultPath = join(root, 'launch.json')
    const packResultPath = join(root, 'pack.jsonl')
    const cacheHome = join(dirname(root), `${basename(root)}-cache`)
    try {
      await mkdir(binPath, { recursive: true })
      await writeFile(join(root, 'package.json'), JSON.stringify({ type: 'module', version: '1.2.3' }))
      await writeFile(fakeNpxPath, [
        '#!/bin/sh',
        'printf "%s\\n" "$5" >> "$LVCE_TEST_PACK_RESULT"',
        'if [ "$LVCE_TEST_FAIL_ASAR" = 1 ]; then exit 9; fi',
        'mkdir -p "$(dirname "$5")"',
        "printf 'packed' > \"$5\"",
        '',
      ].join('\n'))
      await chmod(fakeNpxPath, 0o755)
      await writeFile(fakeElectronPath, [
        '#!/usr/bin/env node',
        "import { writeFileSync } from 'node:fs'",
        "writeFileSync(process.env.LVCE_TEST_LAUNCH_RESULT, 'launched')",
        '',
      ].join('\n'))
      await chmod(fakeElectronPath, 0o755)
      const cli = (await readTemplate('linux_cli_js'))
        .replaceAll('@@APPLICATION_NAME@@', 'lvce')
        .replace('spawn(executablePath, launchArgs, {', `spawn(${JSON.stringify(fakeElectronPath)}, launchArgs, {`)
      await writeFile(cliPath, cli)
      const env = {
        ...process.env,
        LVCE_TEST_FAIL_ASAR: '1',
        LVCE_TEST_PACK_RESULT: packResultPath,
        LVCE_TEST_LAUNCH_RESULT: resultPath,
        PATH: `${root}${delimiter}${process.env.PATH}`,
        XDG_CACHE_HOME: cacheHome,
      }

      await expect(execFileAsync(process.execPath, [cliPath, '--asar', '--wait'], { env })).rejects.toMatchObject({
        code: 1,
        stderr: expect.stringContaining('npx asar exited with code 9'),
      })
      await expect(access(resultPath)).rejects.toMatchObject({ code: 'ENOENT' })

      const { stdout } = await execFileAsync(process.execPath, [cliPath, '--asar', '--wait'], {
        env: { ...env, LVCE_TEST_FAIL_ASAR: '0' },
      })
      expect(stdout).toContain('Creating ASAR application...')
      expect(await readFile(resultPath, 'utf8')).toBe('launched')
      expect((await readFile(packResultPath, 'utf8')).trim().split('\n')).toHaveLength(2)
    } finally {
      await rm(root, { recursive: true, force: true })
      await rm(cacheHome, { recursive: true, force: true })
    }
  })
})
