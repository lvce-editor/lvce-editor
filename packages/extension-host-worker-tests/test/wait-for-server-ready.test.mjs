import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { test } from 'node:test'
import { waitForServerReady } from '../scripts/wait-for-server-ready.mjs'

test('waits for the listening acknowledgement before navigation can begin', async () => {
  const server = new EventEmitter()
  let ready = false
  const pending = waitForServerReady(server).then(() => {
    ready = true
  })
  server.emit('message', 'starting')
  await new Promise((resolve) => setImmediate(resolve))
  assert.equal(ready, false)
  server.emit('message', 'ready')
  await pending
  assert.equal(ready, true)
  assert.deepEqual(server.eventNames(), [])
})

test('rejects startup errors and removes readiness listeners', async () => {
  const server = new EventEmitter()
  const pending = waitForServerReady(server)
  const error = new Error('spawn failed')
  server.emit('error', error)
  await assert.rejects(pending, error)
  assert.deepEqual(server.eventNames(), [])
})

test('rejects an early server exit without waiting for the startup deadline', async () => {
  const server = new EventEmitter()
  const pending = waitForServerReady(server)
  server.emit('exit', 1, null)
  await assert.rejects(pending, /exited before listening/)
  assert.deepEqual(server.eventNames(), [])
})

test('bounds startup and removes listeners when readiness never arrives', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const server = new EventEmitter()
  const pending = waitForServerReady(server)
  t.mock.timers.tick(30_000)
  await assert.rejects(pending, /did not report readiness/)
  assert.deepEqual(server.eventNames(), [])
})
