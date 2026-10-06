import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

test('missing browser exits and removes the test profile after starting the server', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lvce-browser-launch-cleanup-'))
  const runner = fileURLToPath(new URL('../src/_all.js', import.meta.url))
  try {
    const child = spawn(process.execPath, [runner, '--headless', '--ci'], {
      env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: join(directory, 'missing-browser'), TMPDIR: directory, TMP: directory, TEMP: directory },
      timeout: 10_000,
    })
    let output = ''
    child.stdout.on('data', (data) => (output += data))
    child.stderr.on('data', (data) => (output += data))
    const [code, signal] = await once(child, 'exit')
    assert.match(output, /Executable doesn't exist/)
    assert.equal(signal, null)
    assert.equal(code, 128)
    assert.deepEqual(
      (await readdir(directory)).filter((name) => name.startsWith('lvce-extension-host-worker-tests-')),
      [],
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
