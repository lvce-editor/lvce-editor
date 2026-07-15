import { afterAll, beforeAll, expect, test } from '@jest/globals'
import electronPath from 'electron'
import { spawn, spawnSync } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { WebSocketServer } from 'ws'

const expectedOutput = 'Mock response'
const electronExecutable = String(electronPath)
const macOsTaskPolicyError =
  /^\[\d+:\d+\/\d+\.\d+:ERROR:base\/process\/process_mac\.cc:(?:53|98)\] task_policy_set TASK_(?:CATEGORY|SUPPRESSION)_POLICY: \(os\/kern\) invalid argument \(4\)$/
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const mainProcessPath = join(root, 'packages', 'main-process')
const sharedProcessPath = join(root, 'packages', 'shared-process', 'src', 'sharedProcessMain.ts')

let backendUrl = ''
let dbusAddress = ''
let dbusPid = 0
let server
let temporaryDirectory = ''
let webSocketServer

const startDbus = () => {
  if (process.platform !== 'linux') {
    return
  }
  const result = spawnSync('dbus-daemon', ['--session', '--fork', '--print-address=1', '--print-pid=1', '--syslog-only'], {
    encoding: 'utf8',
  })
  if (result.status !== 0) {
    throw new Error(`Failed to start D-Bus: ${result.stderr}`)
  }
  const [address, pid] = result.stdout.trim().split(/\r?\n/)
  dbusAddress = address
  dbusPid = Number(pid)
  if (!dbusAddress || !Number.isInteger(dbusPid)) {
    throw new Error('D-Bus did not return a valid address and process id')
  }
}

const getApplicationStderr = (stderr) => {
  return stderr
    .split(/\r?\n/)
    .filter((line) => !macOsTaskPolicyError.test(line))
    .join('\n')
}

const setCorsHeaders = (request, response) => {
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.setHeader('Access-Control-Allow-Origin', request.headers.origin || '*')
}

const handleRequest = (request, response) => {
  setCorsHeaders(request, response)
  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return
  }
  if (request.method === 'GET' && request.url === '/v1/models') {
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({ data: [{ id: 'test-model', label: 'Test Model' }] }))
    return
  }
  if (request.method === 'POST' && request.url === '/v1/responses') {
    response.setHeader('Content-Type', 'text/event-stream')
    response.end(
      [
        `data: ${JSON.stringify({ delta: expectedOutput, type: 'response.output_text.delta' })}`,
        '',
        `data: ${JSON.stringify({ response: { id: 'response-1' }, type: 'response.completed' })}`,
        '',
      ].join('\n'),
    )
    return
  }
  response.writeHead(404)
  response.end()
}

beforeAll(async () => {
  temporaryDirectory = await mkdtemp(join(tmpdir(), 'lvce-cli-prompt-'))
  startDbus()
  server = createServer(handleRequest)
  webSocketServer = new WebSocketServer({ server })
  webSocketServer.on('connection', (socket) => {
    socket.once('message', () => {
      socket.send(JSON.stringify({ delta: expectedOutput, type: 'response.output_text.delta' }))
      socket.send(JSON.stringify({ response: { id: 'response-1' }, type: 'response.completed' }))
    })
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, 'localhost', () => resolve(undefined))
  })
  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('Mock backend did not bind to a TCP port')
  }
  backendUrl = `http://localhost:${address.port}`
})

afterAll(async () => {
  await new Promise((resolve) => webSocketServer.close(resolve))
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve(undefined)))
  })
  await rm(temporaryDirectory, { force: true, maxRetries: 1, recursive: true, retryDelay: 100 })
  if (dbusPid) {
    process.kill(dbusPid)
  }
})

/** @returns {Promise<{code: number | null, signal: NodeJS.Signals | null, stderr: string, stdout: string}>} */
const runElectron = () => {
  /** @type {NodeJS.ProcessEnv} */
  const env = {
    ...process.env,
    HOME: temporaryDirectory,
    ...(dbusAddress && { DBUS_SESSION_BUS_ADDRESS: dbusAddress }),
    LVCE_ROOT: root,
    LVCE_SHARED_PROCESS_PATH: sharedProcessPath,
    NO_AT_BRIDGE: '1',
    XDG_CACHE_HOME: join(temporaryDirectory, 'cache'),
  }
  delete env.ELECTRON_RUN_AS_NODE
  const electronArguments = [
    '--disable-logging',
    '--no-sandbox',
    `--user-data-dir=${join(temporaryDirectory, 'user-data')}`,
    mainProcessPath,
    '--prompt',
    'test',
    '--backend-url',
    backendUrl,
  ]
  const command = process.platform === 'linux' ? 'xvfb-run' : electronExecutable
  const args = process.platform === 'linux' ? ['--auto-servernum', electronExecutable, ...electronArguments] : electronArguments
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: temporaryDirectory,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stderr = ''
    let stdout = ''
    const timeout = setTimeout(() => {
      child.kill()
      reject(new Error('Electron prompt process did not exit within 45 seconds'))
    }, 45_000)
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })
    child.once('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
    child.once('close', (code, signal) => {
      clearTimeout(timeout)
      resolve({ code, signal, stderr, stdout })
    })
  })
}

test('runs a prompt against the configured backend', async () => {
  const result = await runElectron()
  if (result.code !== 0) {
    console.error(`stdout:\n${result.stdout}`)
    console.error(`stderr:\n${result.stderr}`)
  }
  expect(result.code).toBe(0)
  expect(result.signal).toBeNull()
  expect(getApplicationStderr(result.stderr)).toBe('')
  expect(result.stdout.trim()).toBe(expectedOutput)
}, 60_000)
