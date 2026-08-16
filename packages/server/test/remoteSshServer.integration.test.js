import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

const serverPath = path.join(import.meta.dirname, '..', 'src', 'server.js')

const waitForListeningPort = (child) => {
  return new Promise((resolve, reject) => {
    let output = ''
    const timeout = setTimeout(() => reject(new Error(`Timed out waiting for remote server\n${output}`)), 30_000)
    const onData = (chunk) => {
      output += chunk.toString('utf8')
      const match = output.match(/listening on http:\/\/127\.0\.0\.1:(\d+)/)
      if (match) {
        clearTimeout(timeout)
        child.stdout.off('data', onData)
        resolve(Number.parseInt(match[1], 10))
      }
    }
    child.stdout.on('data', onData)
    child.stderr.on('data', (chunk) => {
      output += chunk.toString('utf8')
    })
    child.once('error', reject)
    child.once('exit', (code) => reject(new Error(`Remote server exited with code ${code}\n${output}`)))
  })
}

const waitForOpen = (webSocket) => {
  return new Promise((resolve, reject) => {
    webSocket.onopen = resolve
    webSocket.onerror = () => reject(new Error('WebSocket failed before opening'))
  })
}

const waitForClose = (webSocket) => {
  return new Promise((resolve) => {
    webSocket.onclose = resolve
    webSocket.onerror = () => {}
  })
}

const createRpc = (webSocket) => {
  let nextId = 1
  const callbacks = new Map()
  webSocket.onmessage = (event) => {
    const response = JSON.parse(event.data)
    const callback = callbacks.get(response.id)
    if (callback) {
      callbacks.delete(response.id)
      callback(response)
    }
  }
  return (method, ...params) => {
    const id = nextId++
    const promise = new Promise((resolve) => callbacks.set(id, resolve))
    webSocket.send(JSON.stringify({ id, jsonrpc: '2.0', method, params }))
    return promise.then((response) => {
      if (response.error) {
        const error = new Error(response.error.message)
        error.code = response.error.data?.code
        throw error
      }
      return response.result
    })
  }
}

const stopProcessGroup = (child) => {
  if (child.exitCode !== null || child.signalCode !== null) {
    return
  }
  try {
    process.kill(process.platform === 'win32' ? child.pid : -child.pid, 'SIGTERM')
  } catch {
    child.kill('SIGTERM')
  }
}

test('remote mode authenticates and exposes existing workspace processes', { skip: typeof WebSocket === 'undefined' }, async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), 'lvce-remote-backend-'))
  const token = 'integration-secret'
  const child = spawn(process.execPath, [serverPath, '--as-remote-ssh-server', '--port=0', `--connection-token=${token}`, '--idle-timeout=30000'], {
    detached: true,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  context.after(async () => {
    stopProcessGroup(child)
    await rm(directory, { force: true, recursive: true })
  })
  const port = await waitForListeningPort(child)

  const unauthorized = new WebSocket(`ws://127.0.0.1:${port}/websocket/file-system-process?token=wrong`)
  await waitForClose(unauthorized)

  const webSocket = new WebSocket(`ws://127.0.0.1:${port}/websocket/file-system-process?token=${token}`)
  await waitForOpen(webSocket)
  context.after(() => webSocket.close())
  const invoke = createRpc(webSocket)

  const toUri = (value) => {
    const url = new URL('file:///')
    url.pathname = value
    return url.href
  }
  assert.equal(await invoke('FileSystem.stat', toUri(directory)), 3)
  const folder = path.join(directory, 'folder')
  const file = path.join(folder, 'file.txt')
  await invoke('FileSystem.mkdir', toUri(folder))
  await invoke('FileSystem.writeFile', toUri(file), Buffer.from('hello').toString('base64'), 'base64')
  assert.equal(Buffer.from(await invoke('FileSystem.readFile', toUri(file), 'base64'), 'base64').toString('utf8'), 'hello')
  assert.deepEqual(await invoke('FileSystem.readDirWithFileTypes', toUri(directory)), [{ name: 'folder', type: 3 }])
  assert.equal(await readFile(file, 'utf8'), 'hello')
  await invoke('FileSystem.forceRemove', toUri(folder))
  await assert.rejects(readFile(file, 'utf8'), { code: 'ENOENT' })

  if (process.platform !== 'win32') {
    const processWebSocket = new WebSocket(`ws://127.0.0.1:${port}/websocket/process-explorer?token=${token}`)
    await waitForOpen(processWebSocket)
    context.after(() => processWebSocket.close())
    const invokeProcessExplorer = createRpc(processWebSocket)
    const rootPid = await invokeProcessExplorer('ProcessId.getMainProcessId', { includeElectronData: false })
    assert.equal(Number.isSafeInteger(rootPid), true)
    const processes = await invokeProcessExplorer('ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage', rootPid, false)
    assert.equal(Array.isArray(processes), true)
    assert.equal(processes.length > 0, true)
  }
})
