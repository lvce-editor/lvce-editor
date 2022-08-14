// based on https://github.com/microsoft/vscode/tree/1.64.2/src/vs/server/node/webClientServer.ts (License MIT)

import { sharedProcessPath } from '@lvce-editor/shared-process'
import { ChildProcess, fork } from 'child_process'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import { createServer } from 'http'
import { dirname, extname, join, resolve } from 'path'
import { pipeline } from 'stream/promises'
import { fileURLToPath } from 'url'

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../../')
const STATIC = resolve(__dirname, '../../../static')
const PORT = process.env.PORT || 3000

const argv = process.argv

let argv2 = argv[2]

if (!argv2) {
  argv2 = resolve(__dirname, '../../../playground')
}

const FOLDER = resolve(process.cwd(), argv2)

const immutable = argv.includes('--immutable')

const IS_WINDOWS = process.platform === 'win32'

const textMimeType = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
}

const getPath = (url) => {
  return url.split(/[?#]/)[0]
}

const serveStatic = (root, skip = '') =>
  async function serveStatic(req, res, next) {
    let relativePath = getPath(req.url.slice(skip.length))
    if (relativePath.endsWith('/')) {
      relativePath += 'index.html'
    }
    // TODO on linux this could be more optimized because it is already encoded correctly (no backslashes)
    const filePath = fileURLToPath(`file://${root}${relativePath}`)
    let fileStat
    try {
      fileStat = await stat(filePath)
    } catch {
      return next()
    }
    const etag = `W/"${[
      fileStat.ino,
      fileStat.size,
      fileStat.mtime.getTime(),
    ].join('-')}"`
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304)
      return res.end()
    }
    const cachingHeader =
      immutable && root === STATIC ? 'public, max-age=31536000, immutable' : ''
    res.writeHead(200, {
      'Content-Type': textMimeType[extname(filePath)] || 'text/plain',
      Etag: etag,
      'Cache-Control': cachingHeader,
      // enables access for performance.measureUserAgentSpecificMemory, see https://web.dev/monitor-total-page-memory-usage/
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    })
    try {
      await pipeline(createReadStream(filePath), res)
    } catch (error) {
      // @ts-ignore
      if (error && error.code === 'ERR_STREAM_PREMATURE_CLOSE') {
        return
      }
      console.info('failed to send request', error)
      // TODO it is unclear how to handle errors here
    }
  }

const serve404 = () =>
  function serve404(req, res, next) {
    console.info(`[web] Failed to serve static file "${req.url}"`)
    res.writeHead(404, {
      'Content-Type': 'text/plain',
    })
    return res.end('Not found')
  }

const createApp = () => {
  const handlerMap = Object.create(null)
  const server = createServer((req, res) => {
    req.on('error', (error) => {
      // @ts-ignore
      if (error && error.code === 'ECONNRESET') {
        return
      }
      console.info('[info: request error]', error)
    })
    // @ts-ignore
    const pathMatch = req.url.match(/^(\/[^\/]*)/)
    // @ts-ignore
    const path = pathMatch[1]
    const handlers = handlerMap[path] || handlerMap['*']
    let i = 0
    const next = () => {
      const fn = i < handlers.length ? handlers[i++] : serve404()
      fn(req, res, next)
    }
    next()
  })
  return {
    use(path, ...handlers) {
      handlerMap[path] = handlers
    },
    listen: server.listen.bind(server),
    on: server.on.bind(server),
    close: server.close.bind(server),
  }
}

const app = createApp()

const serveGitHub = async (req, res) => {
  try {
    await pipeline(createReadStream(join(ROOT, 'static', 'index.html')), res)
  } catch (error) {
    console.info('failed to send request', error)
  }
}

app.use('/github', serveGitHub, serve404())
app.use('/remote', serveStatic('', '/remote'), serve404())
app.use('*', serveStatic(ROOT), serveStatic(STATIC), serve404())

const state = {
  /**
   * @type {(()=>void)[]}
   */
  onSharedProcessReady: [],
  /**
   * @type{ChildProcess|undefined}
   */
  sharedProcess: undefined,
  /**
   * @type{0|1|2}
   */
  sharedProcessState: /* off */ 0,
}

const handleMessage = (message) => {
  if (!process.send) {
    console.log('send not available (2)')
    return
  }
  process.send(message)
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

const handleDisconnect = () => {
  console.info('[web] shared process disconnected')
}

const launchSharedProcess = () => {
  state.sharedProcessState = /* launching */ 1
  delete process.env.ELECTRON_RUN_AS_NODE

  const sharedProcess = fork(sharedProcessPath, {
    stdio: 'inherit',
    // execArgv: ['--trace-deopt'],
    execArgv: ['--enable-source-maps'],
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
    },
  })
  const handleFirstMessage = (message) => {
    state.sharedProcessState = /* on */ 2
    for (const listener of state.onSharedProcessReady) {
      listener()
    }
    state.onSharedProcessReady = []
    sharedProcess.on('message', handleMessage)
  }
  sharedProcess.once('message', handleFirstMessage)
  sharedProcess.on('exit', handleExit)
  sharedProcess.on('disconnect', handleDisconnect)
  state.sharedProcess = sharedProcess
}

// TODO handle all possible errors from shared process

const handleUpgradeSharedProcess = () => {}

/**
 *
 * @param {import('http').IncomingMessage} request
 * @param {import('net').Socket} socket
 */
const handleUpgrade = (request, socket) => {
  const webSocketProtocol = request.headers['sec-websocket-protocol']

  request.on('error', (error) => {
    console.info('[info]: request upgrade error', error)
  })
  socket.on('error', () => {
    // @ts-ignore
    console.info('[info] request socket upgrade error', error)
  })
  switch (state.sharedProcessState) {
    case /* off */ 0:
      state.onSharedProcessReady.push(() => {
        // @ts-ignore
        state.sharedProcess.send(
          { headers: request.headers, method: request.method },
          // @ts-ignore
          socket
        )
      })
      launchSharedProcess()
      break
    case /* launching */ 1:
      state.onSharedProcessReady.push(() => {
        handleUpgrade(request, socket)
      })
      break
    case /* on */ 2:
      // @ts-ignore
      state.sharedProcess.send(
        { headers: request.headers, method: request.method },
        // @ts-ignore
        socket
      )
      break
    default:
      break
  }
}

app.on('upgrade', handleUpgrade)

app.on('error', (error) => {
  // @ts-ignore
  if (error && error.code === 'EADDRINUSE') {
    console.error(
      `[server] Error: port ${PORT} is already taken (possible solution: Run \`killall node\` to free up the port)`
    )
  } else {
    console.error('[info: server error]', error)
  }
})

const handleProcessExit = (code) => {
  console.info(`[server] Process will exit with code ${code}`)
  app.close()
  if (state.sharedProcess && !state.sharedProcess.killed) {
    state.sharedProcess.kill()
    state.sharedProcess = undefined
  }
}

const handleSigInt = () => {
  console.info(`[server] Process will exit because of sigint`)
  app.close()
  if (state.sharedProcess && !state.sharedProcess.killed) {
    state.sharedProcess.kill('SIGINT')
    state.sharedProcess = undefined
  }
}

const handleAppReady = () => {
  if (process.send) {
    console.log('send ready')
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
  process.on('exit', handleProcessExit)
  process.on('SIGINT', handleSigInt)
  process.on('uncaughtExceptionMonitor', handleUncaughtExceptionMonitor)
  app.listen(PORT, handleAppReady)
}

main()
