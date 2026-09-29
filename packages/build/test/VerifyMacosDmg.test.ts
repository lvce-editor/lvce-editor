import { expect, test } from '@jest/globals'
import { execFile } from 'node:child_process'
import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const testPosix = process.platform === 'win32' ? test.skip : test
const scriptPath = fileURLToPath(new URL('../scripts/github-actions/verify-macos-dmg.sh', import.meta.url))

// Stub macOS system tools, while running the real verification script and CLI checks.
const harness = `
function hdiutil() {
  if [[ "$1" == attach ]]; then
    cp -R "$FIXTURE_APP" "$6/"
  else
    rm -rf "$2/Fixture.app"
  fi
}
function /usr/libexec/PlistBuddy() { echo 1.2.3; }
function xattr() { return 1; }
export -f xattr
function codesign() { echo codesign; }
function spctl() { echo spctl; }
function xcrun() { echo stapler; }
source "$@"
`

testPosix.each(['lvce', 'lvce-oss'])('verifies the %s installer CLI and signing', async (applicationName) => {
  const root = await mkdtemp(join(tmpdir(), 'verify-macos-dmg-'))
  try {
    const app = join(root, 'Fixture.app')
    const bin = join(app, 'Contents/Resources/app/bin')
    await mkdir(bin, { recursive: true })
    const cli = join(bin, applicationName)
    await writeFile(cli, '#!/bin/sh\ncase "$1" in -v|--version) echo 1.2.3 ;; *) exit 1 ;; esac\n')
    await chmod(cli, 0o755)
    const dmg = join(root, 'fixture.dmg')
    await writeFile(dmg, '')
    const args = ['-c', harness, 'verify-macos-dmg', scriptPath, dmg]
    if (applicationName !== 'lvce') {
      args.push(applicationName)
    }
    const { stdout } = await execFileAsync('bash', args, {
      env: { ...process.env, FIXTURE_APP: app, RUNNER_TEMP: root },
    })
    expect(stdout).toBe('codesign\nspctl\nstapler\n')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
