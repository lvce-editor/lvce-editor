// based on https://github.com/microsoft/vscode/tree/1.64.2/src/vs/server/node/webClientServer.ts (License MIT)

import { sharedProcessPath } from '@lvce-editor/shared-process'
import { ChildProcess, fork } from 'node:child_process'
import { createReadStream } from 'node:fs'
import { readdir, readFile, stat } from 'node:fs/promises'
import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import { dirname, extname, join, resolve } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath, parse as parseUrl } from 'node:url'

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../../')
const STATIC = resolve(__dirname, '../../../static')
const PORT = process.env.PORT || 3000

const { argv } = process

let argv2 = argv[2]

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

const FOLDER = resolve(process.cwd(), argv2)

const immutable = argv.includes('--immutable')

const IS_WINDOWS = process.platform === 'win32'

const textMimeType = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.woff': 'application/font-woff',
  '.png': 'image/png',
  '.jpe': 'image/jpg',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpg',
  '.jpg': 'image/jpg',
  '.webp': 'image/webp',
}

const getPath = (url) => {
  return url.split(/[?#]/)[0]
}

const serveStatic = (root, skip = '') =>
  async function serveStatic(req, res, next) {
    const parsedUrl = parseUrl(req.url)
    const pathName = parsedUrl.pathname || ''
    let relativePath = getPath(pathName.slice(skip.length))
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
      // @ts-ignore
      if (error && error.code === 'EISDIR') {
        res.writeHead(404)
        res.end()
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

const getTestPath = () => {
  if (process.env.TEST_PATH) {
    const testPath = process.env.TEST_PATH
    return join(process.cwd(), testPath)
  }
  return join(ROOT, 'packages', 'extension-host-worker-tests')
}

const generateTestOverviewHtml = (dirents) => {
  const pre = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tests</title>
  </head>
  <body>
    <h1>Tests</h1>
    <p>Available Tests</p>
    <ul>
`
  let middle = ``
  // TODO properly escape name
  for (const dirent of dirents) {
    if (dirent.endsWith('.js') && !dirent.startsWith('_')) {
      const name = dirent.slice(0, -'.js'.length)
      middle += `      <li><a href="./${name}.html">${name}</a></li>
`
    }
  }

  const post = `    </ul>
  </body>
</html>
`
  return pre + middle + post
}

const createTestOverview = async (testPathSrc) => {
  const dirents = await readdir(testPathSrc)
  const testOverviewHtml = generateTestOverviewHtml(dirents)
  return testOverviewHtml
}

/**
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
const serveTests = async (req, res, next) => {
  const parsedUrl = parseUrl(req.url || '')
  const pathName = parsedUrl.pathname || ''
  if (pathName.endsWith('.html')) {
    try {
      await pipeline(createReadStream(join(ROOT, 'static', 'index.html')), res)
    } catch (error) {
      // @ts-ignore
      if (error && error.code === 'EISDIR') {
        res.statusCode = 404
        res.end()
        return
      }
      console.info('failed to send request', error)
      res.statusCode = 500
      // TODO escape error html
      res.end(`${error}`)
    }
    return
  }
  if (pathName === '/tests/') {
    const testPath = getTestPath()
    const testPathSrc = join(testPath, 'src')

    try {
      const testOverview = await createTestOverview(testPathSrc)
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
      res.statusCode = 300
      res.end(testOverview)
    } catch (error) {
      // @ts-ignore
      if (error && error.code === 'ENOENT') {
        res.statusCode = 404
        // TODO escape path for html
        res.end(`No test files found at ${testPathSrc}`)
        return
      }
      res.statusCode = 500
      // TODO escape error html
      res.end(`${error}`)
    }
    return
  }

  next()
}

const getAbsolutePath = (extensionName) => {
  return join(ROOT, 'extensions', extensionName, 'extension.json')
}

const isLanguageBasics = (name) => {
  return name.startsWith('builtin.language-basics')
}

const readJson = async (path) => {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content)
}

const combineLanguages = (extensions) => {
  const languages = []
  for (const extension of extensions) {
    if (extension.languages) {
      for (const language of extension.languages) {
        languages.push({
          ...language,
          tokenize: `/extensions/${extension.id}/${language.tokenize}`,
        })
      }
    }
  }
  return languages
}

const getLanguagesJson = async () => {
  const extensionNames = await readdir(join(ROOT, 'extensions'))
  const languageBasics = extensionNames.filter(isLanguageBasics)
  const extensionPaths = languageBasics.map(getAbsolutePath)
  const extensions = await Promise.all(extensionPaths.map(readJson))
  const languages = combineLanguages(extensions)
  return languages
}

const sendFile = async (path, res) => {
  try {
    await pipeline(createReadStream(path), res)
  } catch (error) {
    // @ts-ignore
    if (error && error.code === 'EISDIR') {
      res.statusCode = 404
      res.end()
      return
    }
    console.info('failed to send request', error)
    res.statusCode = 500
    // TODO escape error html
    res.end(`${error}`)
  }
  return
}

const serveConfig = async (req, res, next) => {
  const parsedUrl = parseUrl(req.url || '')
  const pathName = parsedUrl.pathname || ''
  if (pathName === '/config/languages.json') {
    const languagesJson = await getLanguagesJson()
    res.statusCode = 200
    res.end(JSON.stringify(languagesJson, null, 2))
    return
  }
  switch (pathName) {
    case '/config/defaultKeyBindings.json':
    case '/config/builtinCommands.json':
    case '/config/defaultSettings.json':
    case '/config/webExtensions.json':
      return sendFile(join(ROOT, 'static', pathName), res)
    default:
      break
  }
  next()
}

app.use('/github', serveGitHub, serve404())
app.use('/remote', serveStatic('', '/remote'), serve404())
app.use('/tests', serveTests, serve404())
app.use('/config', serveConfig, serve404())
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

  const sharedProcess = fork(
    sharedProcessPath,
    // execArgv: ['--trace-deopt'],
    ['--enable-source-maps', ...argvSliced],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: '1', // TODO only needed when server is run inside electron app
      },
    }
  )
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
  process.on('uncaughtExceptionMonitor', handleUncaughtExceptionMonitor)
  app.listen(PORT, handleAppReady)
}

main()
