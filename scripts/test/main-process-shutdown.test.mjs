import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

test('main-process unit tests finish under concurrent allocation pressure', () => {
  const workspace = new URL('../../packages/main-process/', import.meta.url)
  const { scripts } = JSON.parse(readFileSync(new URL('package.json', workspace), 'utf8'))
  const [command, ...args] = scripts.test.split(' ')
  assert.equal(command, 'node')
  const fixture = fileURLToPath(new URL('./fixtures/stress-process-exit.cjs', import.meta.url))
  const result = spawnSync(process.execPath, ['--stress-concurrent-allocation', '--require', fixture, ...args], {
    cwd: workspace,
    encoding: 'utf8',
    killSignal: 'SIGKILL',
    timeout: 30_000,
  })
  const output = `${result.stdout}\n${result.stderr}`
  assert.equal(result.error, undefined, `${result.error}\n${output}`)
  assert.equal(result.signal, null, output)
  assert.equal(result.status, 0, output)
  assert.match(output, /Tests:.*\b[1-9]\d* passed/)
})
