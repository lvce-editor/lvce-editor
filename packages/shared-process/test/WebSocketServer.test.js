import http from 'node:http'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { WebSocket } from 'ws'
import * as WebSocketServer from '../src/parts/WebSocketServer/WebSocketServer.js'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

test('WebSocketServer', async () => {
  const httpServer = http.createServer((req, res) => {
    WebSocketServer.handleUpgrade(
      {
        headers: req.headers,
        method: req.method,
      },
      req.socket
    )
  })
  const port = await new Promise((resolve, reject) => {
    httpServer.listen(0, () => {
      const address = httpServer.address()
      if (address === null || typeof address === 'string') {
        reject(new Error('unexpected address type'))
        return
      }
      resolve(address.port)
    })
  })
  const webSocket = new WebSocket(`ws://localhost:${port}`)
  await new Promise((resolve) => {
    webSocket.onopen = () => {
      resolve(undefined)
    }
  })
  const messageBufferPromise = new Promise((resolve) => {
    webSocket.on('message', (message) => {
      resolve(message)
    })
  })
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'abc.txt'), 'abc')
  webSocket.send(
    JSON.stringify({
      jsonrpc: '2.0',
      method: /* FileSystem.readFile */ 'FileSystem.readFile',
      params: [join(tmpDir, 'abc.txt')],
      id: 1,
    })
  )
  const messageBuffer = await messageBufferPromise
  const messageString = messageBuffer.toString()
  const message = JSON.parse(messageString)
  expect(message).toEqual({
    id: 1,
    jsonrpc: '2.0',
    result: 'abc',
  })
  webSocket.close()
  httpServer.close()
})

// TODO have e2e test for socket error handling (e.g. rangeError or connection died or EPIPE)

// TODO how to emit and test error?
test.skip('WebSocketServer - handle socket error', async () => {
  const httpServer = http.createServer((req, res) => {
    WebSocketServer.handleUpgrade(
      {
        headers: req.headers,
        method: req.method,
      },
      req.socket
    )
    req.socket._destroy(new RangeError('invalid range specified'), () => {})
    // setInterval(() => {
    // req.socket.emit('error', new RangeError('invalid range specified'))
    // }, 100)
  })
  const port = await new Promise((resolve, reject) => {
    httpServer.listen(0, () => {
      const address = httpServer.address()
      if (address === null || typeof address === 'string') {
        reject(new Error('unexpected address type'))
        return
      }
      resolve(address.port)
    })
  })
  const webSocket = new ws.WebSocket(`ws://localhost:${port}`)
  await new Promise((resolve) => {
    webSocket.onopen = () => {
      resolve()
    }
  })
})
