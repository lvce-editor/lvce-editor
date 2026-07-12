import { describe, expect, test } from '@jest/globals'
import { execFile } from 'node:child_process'
import { chmod, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

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

  test('resolves the native executable when invoked through a symlink', async () => {
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

  test('detaches graphical launches and ignores their output', async () => {
    const cli = await readTemplate('linux_cli_js')

    expect(cli).toContain('detached: !foreground')
    expect(cli).toContain("stdio: foreground ? ['inherit', 'inherit', 'pipe'] : 'ignore'")
  })

  test('only filters structured Electron diagnostics for non-verbose cli commands', async () => {
    const cli = await readTemplate('linux_cli_js')

    expect(cli).toContain('const electronDiagnosticPattern = /^\\[\\d+:\\d+\\/\\d+\\.\\d+:(?:ERROR|WARNING):/')
    expect(cli).toContain('child.stderr.pipe(process.stderr)')
  })
})
