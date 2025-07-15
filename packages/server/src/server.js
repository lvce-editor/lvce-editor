// based on https://github.com/microsoft/vscode/tree/1.64.2/src/vs/server/node/webClientServer.ts (License MIT)

import { ChildProcess, fork } from 'node:child_process'
import { createServer } from 'node:http'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Worker } from 'node:worker_threads'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../../')

const { argv, env } = process

const PORT = env.PORT ? parseInt(env.PORT) : 3000

let argv2 = argv[2]

// TODO pass argv to shared process instead of using environment variables / global variables
const argvSliced = argv.slice(2)
for (const arg of argvSliced) {
  if (arg.startsWith('--only-extension=')) {
    process.env['ONLY_EXTENSION'] = arg.slice('--only-extension='.length)
  } else if (arg.startsWith('--test-path=')) {
    process.env['TEST_PATH'] = arg.slice('--test-path='.length)
  }
}

if (!argv2) {
  argv2 = resolve(__dirname, '../../../playground')
}

const isPublic = argv.includes('--public')

/**
 * @enum {string}
 */
const ErrorCodes = {
  ERR_STREAM_PREMATURE_CLOSE: 'ERR_STREAM_PREMATURE_CLOSE',
  EISDIR: 'EISDIR',
  ECONNRESET: 'ECONNRESET',
  ENOENT: 'ENOENT',
  EADDRINUSE: 'EADDRINUSE',
}

const isStatic = (url) => {
  if (url.startsWith('/config')) {
    return true
  }
  if (url.startsWith('/css')) {
    return true
  }
  if (url.startsWith('/fonts')) {
    return true
  }
  if (url.startsWith('/icons')) {
    return true
  }
  if (url.startsWith('/images')) {
    return true
  }
  if (url.startsWith('/js')) {
    return true
  }
  if (url.startsWith('/lib-css')) {
    return true
  }
  if (url.startsWith('/sounds')) {
    return true
  }
  if (url.startsWith('/themes')) {
    return true
  }
  if (url.startsWith('/favicon.ico')) {
    return true
  }
  if (url.startsWith('/manifest.json')) {
    return true
  }
  if (url.startsWith('/packages') && url.endsWith('.js')) {
    return true
  }
  return false
}

const handleRequest = (req, res) => {
  if (isStatic(req.url)) {
    return handleResponseViaStaticServer(req, res, 'StaticServer.getResponse')
  }
  return sendHandleSharedProcess(req, res.socket, 'HandleRequest.handleRequest')
}

const state = {
  /**
   * @type {Promise<ChildProcess>|undefined}
   */
  sharedProcessPromise: undefined,
  /**
   * @type {Promise<ChildProcess>|undefined}
   */
  staticProcessPromise: undefined,
}

const handleMessageFromParent = (message) => {
  // TODO is it actually necessary to change environment variables here?
  if (message.method === 'Platform.setEnvironmentVariables') {
    const env = message.params[0]
    for (const [key, value] of Object.entries(env)) {
      process.env[key] = value
    }
  }
  switch (state.sharedProcessState) {
    case /* off */ 0:
      console.warn('cannot send message (1)')
      break
    case /* launching */ 1:
      console.warn('cannot send message (2)')
      break
    case /* on */ 2:
      // @ts-ignore
      state.sharedProcess.send(message)
      break
    default:
      break
  }
}

const handleExit = (code) => {
  process.exit(code)
}

const handleSharedProcessDisconnect = () => {
  console.info('[server] shared process disconnected')
}

const waitForProcessToBeReady = async (childProcess) => {
  const { resolve, promise } = Promise.withResolvers()
  childProcess.once('message', resolve)
  const message = await promise
  if (message !== 'ready') {
    throw new Error('unexpected message')
  }
}

/**
 *
 * @returns {Promise<any>}
 */
const launchProcess = async (processPath, execArgv) => {
  const isWorker = execArgv.includes('--ipc-type=node-worker')
  if (isWorker) {
    const childProcess = new Worker(processPath, {
      argv: execArgv,
      env: {
        ...process.env,
      },
    })
    childProcess.on('exit', handleExit)
    childProcess.on('disconnect', handleSharedProcessDisconnect)
    await waitForProcessToBeReady(childProcess)
    return {
      send(message) {
        childProcess.postMessage(message)
      },
      on(event, listener) {
        childProcess.on(event, listener)
      },
      off(event, listener) {
        childProcess.off(event, listener)
      },
    }
  } else {
    const childProcess = fork(processPath, execArgv, {
      stdio: 'inherit',
      env: {
        ...process.env,
      },
      execArgv: [],
    })
    childProcess.on('exit', handleExit)
    childProcess.on('disconnect', handleSharedProcessDisconnect)
    await waitForProcessToBeReady(childProcess)
    return childProcess
  }
}

/**
 *
 * @returns {Promise<ChildProcess>}
 */
const launchSharedProcess = async () => {
  const sharedProcessPath = join(ROOT, 'packages', 'shared-process', 'src', 'sharedProcessMain.js')
  return launchProcess(sharedProcessPath, ['--enable-source-maps', '--ipc-type=node-forked-process', ...argvSliced])
}

/**
 *
 * @returns {Promise<ChildProcess>}
 */
const getOrCreateSharedProcess = () => {
  if (!state.sharedProcessPromise) {
    state.sharedProcessPromise = launchSharedProcess()
  }
  return state.sharedProcessPromise
}

/**
 *
 * @returns {Promise<ChildProcess>}
 */
const launchStaticServerProcess = async () => {
  const staticServerPath = join(ROOT, 'packages', 'static-server', 'src', 'static-server.js')
  const ipc = await launchProcess(staticServerPath, ['--ipc-type=node-worker'])
  ipc.on('message', handleMessage)

  return ipc
}

/**
 *
 * @returns {Promise<ChildProcess>}
 */
const getOrCreateStaticServerPathProcess = () => {
  if (!state.staticProcessPromise) {
    state.staticProcessPromise = launchStaticServerProcess()
  }
  return state.staticProcessPromise
}

// TODO handle all possible errors from shared process

const getHandleMessage = (request) => {
  return {
    headers: request.headers,
    method: request.method,
    path: request.path,
    url: request.url,
    httpVersionMajor: request.httpVersionMajor,
    httpVersionMinor: request.httpVersionMinor,
    query: request.query,
  }
}

const handleRequestError = (error) => {
  if (error && error.code === 'ECONNRESET') {
    // ignore
    return
  }
  console.info('[info]: request upgrade error', error)
}

const handleSocketUpgradeError = (error) => {
  // @ts-ignore
  console.info('[info] request socket upgrade error', error)
}

const handleSocketError = (error) => {
  if (error && error.code === 'ECONNRESET') {
    return
  }
  // @ts-ignore
  console.info('[info] request socket error', error)
}

const sendHandleSharedProcess = async (request, socket, method, ...params) => {
  request.on('error', handleRequestError)
  socket.on('error', handleSocketUpgradeError)
  const sharedProcess = await getOrCreateSharedProcess()
  sharedProcess.send(
    {
      jsonrpc: '2.0',
      method,
      params: [getHandleMessage(request), ...params],
    },
    socket,
    {
      keepOpen: false,
    },
  )
}

let id = 1

const createId = () => {
  return ++id
}

const setHeaders = (response, headers) => {
  for (const [key, value] of Object.entries(headers)) {
    response.setHeader(key, value)
  }
}

const callbacks = Object.create(null)

const registerCallback = () => {
  const id = createId()
  const { resolve, promise } = Promise.withResolvers()
  callbacks[id] = resolve
  return {
    id,
    promise,
  }
}

const handleMessage = (message) => {
  const { id } = message
  if (callbacks[id]) {
    callbacks[id](message)
    delete callbacks[id]
  }
}

const hasErrorListener = new WeakSet()

const handleResponseViaStaticServer = async (request, res, method, ...params) => {
  request.on('error', handleRequestError)
  if (!hasErrorListener.has(res.socket)) {
    res.socket.on('error', handleSocketError)
    hasErrorListener.add(res.socket)
  }
  const staticServerProcess = await getOrCreateStaticServerPathProcess()
  const { id, promise } = registerCallback()
  // TODO use rpc and invoke
  staticServerProcess.send({
    jsonrpc: '2.0',
    id,
    method,
    params: [getHandleMessage(request), ...params],
  })
  const response = await promise
  const { result } = response
  const { status, headers, body, hasBody } = result
  if (!status) {
    throw new Error('invalid status')
  }
  res.statusCode = status
  setHeaders(res, headers)
  if (hasBody) {
    res.end(body)
  }
}

/**
 *
 * @param {import('http').IncomingMessage} request
 * @param {import('net').Socket} socket
 */
const handleUpgrade = (request, socket) => {
  sendHandleSharedProcess(request, socket, 'HandleWebSocket.handleWebSocket')
}

const handleServerError = (error) => {
  // @ts-ignore
  if (error && error.code === ErrorCodes.EADDRINUSE) {
    console.error(`[server] Error: port ${PORT} is already taken (possible solution: Run \`killall node\` to free up the port)`)
  } else {
    console.error('[info: server error]', error)
  }
}

const handleAppReady = () => {
  if (process.send) {
    process.send('ready')
  } else {
    console.info(`[server] listening on http://localhost:${PORT}`)
  }
}

const handleUncaughtExceptionMonitor = (error, origin) => {
  console.info('[server] Uncaught exception')
  console.info(error)
}

const main = () => {
  process.on('message', handleMessageFromParent)
  process.on('uncaughtExceptionMonitor', handleUncaughtExceptionMonitor)
  const server = createServer(handleRequest)
  server.on('listening', handleAppReady)
  server.on('upgrade', handleUpgrade)
  server.on('error', handleServerError)
  const host = isPublic ? undefined : 'localhost'
  server.listen(PORT, host)
}

main()
