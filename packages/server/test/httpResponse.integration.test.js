import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

const serverPath = path.join(import.meta.dirname, '..', 'src', 'server.js')

const waitForListeningPort = (child) => {
  return new Promise((resolve, reject) => {
    let output = ''
    const timeout = setTimeout(() => reject(new Error(`Timed out waiting for server\n${output}`)), 30_000)
    const onData = (chunk) => {
      output += chunk.toString('utf8')
      const match = output.match(/listening on http:\/\/localhost:(\d+)/)
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
    child.once('exit', (code) => reject(new Error(`Server exited with code ${code}\n${output}`)))
  })
}

const killProcessGroup = (child, signal) => {
  if (child.exitCode !== null || child.signalCode !== null) {
    return
  }
  try {
    process.kill(process.platform === 'win32' ? child.pid : -child.pid, signal)
  } catch {
    child.kill(signal)
  }
}

const stopProcessGroup = async (child) => {
  if (child.exitCode !== null || child.signalCode !== null) {
    return
  }
  const exited = once(child, 'exit')
  killProcessGroup(child, 'SIGTERM')
  let timeout
  const timedOut = new Promise((resolve) => {
    timeout = setTimeout(resolve, 5_000, 'timeout')
  })
  const result = await Promise.race([exited.then(() => 'exited'), timedOut])
  clearTimeout(timeout)
  if (result === 'timeout') {
    killProcessGroup(child, 'SIGKILL')
    await exited
  }
}

test('serves binary and partial responses returned by the shared process', async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), 'lvce-http-response-'))
  const file = path.join(directory, 'video.bin')
  const content = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  await writeFile(file, content)

  const child = spawn(process.execPath, [serverPath], {
    detached: true,
    env: {
      ...process.env,
      PORT: '0',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  context.after(async () => {
    await stopProcessGroup(child)
    await rm(directory, { force: true, recursive: true })
  })
  const port = await waitForListeningPort(child)
  const url = `http://localhost:${port}/remote${encodeURI(file)}`

  const response = await fetch(url)
  assert.equal(response.status, 200)
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), content)

  const partialResponse = await fetch(url, {
    headers: {
      Range: 'bytes=2-5',
    },
  })
  assert.equal(partialResponse.status, 206)
  assert.equal(partialResponse.headers.get('accept-ranges'), 'bytes')
  assert.equal(partialResponse.headers.get('content-range'), 'bytes 2-5/10')
  assert.deepEqual(Buffer.from(await partialResponse.arrayBuffer()), Buffer.from([2, 3, 4, 5]))

  const headResponse = await fetch(url, { method: 'HEAD' })
  assert.equal(headResponse.status, 200)
  assert.equal((await headResponse.arrayBuffer()).byteLength, 0)
})
