import { expect, test } from '@jest/globals'
import { execFile } from 'node:child_process'
import { chmod, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const testPosix = process.platform === 'win32' ? test.skip : test

const readTemplate = async (name: string) => {
  return readFile(new URL(`../src/parts/Template/template_${name}.txt`, import.meta.url), 'utf8')
}

testPosix('macOS launcher resolves relative symlinks and prints the app version for both flags', async () => {
  const root = await mkdtemp(join(tmpdir(), 'lvce-macos-cli-'))
  try {
    const contents = join(root, 'Lvce Editor.app', 'Contents')
    const appRoot = join(contents, 'Resources', 'app')
    const bin = join(appRoot, 'bin')
    const macos = join(contents, 'MacOS')
    await mkdir(bin, { recursive: true })
    await mkdir(macos)
    await writeFile(join(appRoot, 'package.json'), JSON.stringify({ type: 'module', version: '1.2.3' }))
    await writeFile(join(bin, 'cli.js'), await readTemplate('linux_cli_js'))
    await writeFile(join(bin, 'lvce'), await readTemplate('macos_cli'))
    await chmod(join(bin, 'lvce'), 0o755)
    // Node stands in for Electron's Node mode so the version path cannot open a GUI.
    await symlink(process.execPath, join(macos, 'Electron'))
    await symlink('Lvce Editor.app/Contents/Resources/app/bin/lvce', join(root, 'first'))
    await symlink('first', join(root, 'lvce'))

    for (const flag of ['-v', '--version']) {
      const { stdout, stderr } = await execFileAsync(join(root, 'lvce'), [flag])
      expect(stdout).toBe('1.2.3\n')
      expect(stderr).toBe('')
    }

    // Verify argument boundaries and Node mode at the native executable boundary.
    await rm(join(macos, 'Electron'))
    await writeFile(join(macos, 'Electron'), '#!/bin/sh\nprintf "%s\\n" "$ELECTRON_RUN_AS_NODE" "$@"\n')
    await chmod(join(macos, 'Electron'), 0o755)
    const { stdout } = await execFileAsync(join(root, 'lvce'), ['a file.txt', '--wait'])
    expect(stdout.trim().split('\n').slice(-2)).toEqual(['a file.txt', '--wait'])
    expect(stdout.startsWith('1\n')).toBe(true)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
