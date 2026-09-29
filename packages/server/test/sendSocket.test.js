import assert from 'node:assert/strict'
import { fork } from 'node:child_process'
import { once } from 'node:events'
import { createConnection, createServer } from 'node:net'
import test from 'node:test'
import { sendSocket } from '../src/sendSocket.js'

test('preserves the first request while the child has not acknowledged the socket handoff', { timeout: 10000 }, async (context) => {
  const child = fork(new URL('./fixtures/socket-transfer-child.js', import.meta.url))
  context.after(() => child.kill())
  const server = createServer((socket) => sendSocket(child, { type: 'socket' }, socket))
  context.after(() => server.close())
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const client = createConnection(server.address().port, '127.0.0.1')
  context.after(() => client.destroy())
  const [ready] = await once(client, 'data')
  assert.equal(ready.toString(), 'ready\n')
  const response = once(client, 'data', { signal: AbortSignal.timeout(5000) })
  client.write('first request')
  const [data] = await response
  assert.equal(data.toString(), 'first request')
})
