import { describe, expect, test } from '@jest/globals'
import { execFile, spawn } from 'node:child_process'
import { chmod, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
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
        'spawn(process.execPath, args, {',
        `spawn(${JSON.stringify(fakeElectronPath)}, args, {`,
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
})
