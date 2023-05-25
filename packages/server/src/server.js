// based on https://github.com/microsoft/vscode/tree/1.64.2/src/vs/server/node/webClientServer.ts (License MIT)

import { ChildProcess, fork } from 'node:child_process'
import { createReadStream } from 'node:fs'
import { readFile, readdir, stat } from 'node:fs/promises'
import { IncomingMessage, ServerResponse, createServer } from 'node:http'
import { dirname, extname, join, resolve } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../../')
const STATIC = resolve(__dirname, '../../../static')

const sharedProcessPath = join(ROOT, 'packages', 'shared-process', 'src', 'sharedProcessMain.js')

const { argv, env } = process

const PORT = env.PORT ? parseInt(env.PORT) : 3000

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

const isImmutable = argv.includes('--immutable')

const isPublic = argv.includes('--public')

const IS_WINDOWS = process.platform === 'win32'

const addSemicolon = (line) => {
  return line + ';'
}

const ContentSecurityPolicy = {
  key: 'Content-Security-Policy',
  value: [
    `default-src 'none'`,
    `connect-src 'self'`,
    `font-src 'self'`,
    `frame-src *`,
    `img-src 'self' https: data: blob:`,
    `script-src 'self'`,
    `media-src 'self'`,
    `manifest-src 'self'`,
    `style-src 'self' 'unsafe-inline'`, // TODO remove unsafe-inline
  ]
    .map(addSemicolon)
    .join(' '),
}

const ContentSecurityPolicyWorker = {
  key: 'Content-Security-Policy',
  value: [
    `default-src 'none'`,
    `connect-src 'self' ws:`, // TODO allow connecting to websocket urls for debugging but not other websocket urls
    `script-src 'self'`,
    `font-src 'self'`,
  ]
    .map(addSemicolon)
    .join(' '),
}

const ContentSecurityPolicyTests = {
  key: ContentSecurityPolicy.key,
  value: ContentSecurityPolicy.value.replace(`script-src 'self'`, `script-src 'self' 'unsafe-eval'`),
}

const CrossOriginOpenerPolicy = {
  key: 'Cross-Origin-Opener-Policy',
  value: 'same-origin',
}

const CrossOriginEmbedderPolicy = {
  key: 'Cross-Origin-Embedder-Policy',
  value: 'require-corp',
}

const textMimeType = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
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

/**
 * @enum {string}
 */
const CachingHeaders = {
  Empty: '',
  NoCache: 'public, max-age=0, must-revalidate',
  OneYear: 'public, max-age=31536000, immutable',
}

/**
 * @enum {number}
 */
const StatusCode = {
  NotFound: 404,
  ServerError: 500,
  Ok: 200,
  MultipleChoices: 300,
  NotModified: 304,
}

const getPath = (url) => {
  return url.split(/[?#]/)[0]
}

const getContentType = (filePath) => {
  return textMimeType[extname(filePath)] || 'text/plain'
}

const serveStatic = (root, skip = '') =>
  async function serveStatic(req, res, next) {
    const parsedUrl = new URL(req.url)
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
    const etag = `W/"${[fileStat.ino, fileStat.size, fileStat.mtime.getTime()].join('-')}"`
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(StatusCode.NotModified)
      return res.end()
    }
    const isHtml = relativePath.endsWith('index.html')
    let cachingHeader = CachingHeaders.NoCache
    if (isHtml) {
      cachingHeader = CachingHeaders.NoCache
    } else if (isImmutable && root === STATIC) {
      cachingHeader = CachingHeaders.OneYear
    }
    const contentType = getContentType(filePath)
    const headers = {
      'Content-Type': contentType,
      Etag: etag,
      'Cache-Control': cachingHeader,
    }
    if (contentType === 'text/html') {
      headers[ContentSecurityPolicy.key] = ContentSecurityPolicy.value
      // enables access for performance.measureUserAgentSpecificMemory, see https://web.dev/monitor-total-page-memory-usage/
      headers[CrossOriginEmbedderPolicy.key] = CrossOriginEmbedderPolicy.value
      headers[CrossOriginOpenerPolicy.key] = CrossOriginOpenerPolicy.value
    }
    if (filePath.endsWith('WorkerMain.js')) {
      headers[CrossOriginEmbedderPolicy.key] = CrossOriginEmbedderPolicy.value
      headers[ContentSecurityPolicyWorker.key] = ContentSecurityPolicyWorker.value
    }
    res.writeHead(StatusCode.Ok, headers)
    try {
      await pipeline(createReadStream(filePath), res)
    } catch (error) {
      // @ts-ignore
      if (error && error.code === ErrorCodes.ERR_STREAM_PREMATURE_CLOSE) {
        return
      }
      // @ts-ignore
      if (error && error.code === ErrorCodes.EISDIR) {
        res.writeHead(StatusCode.NotFound)
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
    const headers = {
      'Content-Type': 'text/plain',
    }
    if (req.url.endsWith('WorkerMain.js')) {
      headers[CrossOriginEmbedderPolicy.key] = CrossOriginEmbedderPolicy.value
      headers[ContentSecurityPolicyWorker.key] = ContentSecurityPolicyWorker.value
    }
    res.writeHead(StatusCode.NotFound, headers)
    return res.end('Not found')
  }

const createApp = () => {
  const handlerMap = Object.create(null)
  const server = createServer((req, res) => {
    req.on('error', (error) => {
      // @ts-ignore
      if (error && error.code === ErrorCodes.ECONNRESET) {
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
  const parsedUrl = new URL(req.url || '')
  const pathName = parsedUrl.pathname || ''
  if (pathName.endsWith('.html')) {
    res.writeHead(StatusCode.Ok, {
      'Content-Type': 'text/html',
      [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
      [CrossOriginOpenerPolicy.key]: CrossOriginOpenerPolicy.value,
      [ContentSecurityPolicyTests.key]: ContentSecurityPolicyTests.value,
    })
    try {
      await pipeline(createReadStream(join(ROOT, 'static', 'index.html')), res)
    } catch (error) {
      // @ts-ignore
      if (error && error.code === ErrorCodes.ERR_STREAM_PREMATURE_CLOSE) {
        return
      }
      // @ts-ignore
      if (error && error.code === ErrorCodes.EISDIR) {
        res.statusCode = StatusCode.NotFound
        res.end()
        return
      }
      console.info('failed to send request', error)
      res.statusCode = StatusCode.ServerError
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
      res.setHeader('Cache-Control', CachingHeaders.NoCache)
      res.statusCode = StatusCode.MultipleChoices
      res.end(testOverview)
    } catch (error) {
      // @ts-ignore
      if (error && error.code === ErrorCodes.ENOENT) {
        res.statusCode = StatusCode.NotFound
        // TODO escape path for html
        res.end(`No test files found at ${testPathSrc}`)
        return
      }
      res.statusCode = StatusCode.ServerError
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
    if (error && error.code === ErrorCodes.ERR_STREAM_PREMATURE_CLOSE) {
      return
    }
    // @ts-ignore
    if (error && error.code === ErrorCodes.EISDIR) {
      res.statusCode = StatusCode.NotFound
      res.end()
      return
    }
    console.info('failed to send request', error)
    res.statusCode = StatusCode.ServerError
    // TODO escape error html
    res.end(`${error}`)
  }
  return
}

const serveConfig = async (req, res, next) => {
  const parsedUrl = new URL(req.url || '')
  const pathName = parsedUrl.pathname || ''
  if (pathName === '/config/languages.json') {
    const languagesJson = await getLanguagesJson()
    res.statusCode = StatusCode.Ok
    res.end(JSON.stringify(languagesJson, null, 2))
    return
  }
  switch (pathName) {
    case '/config/defaultKeyBindings.json':
    case '/config/builtinCommands.json':
    case '/config/defaultSettings.json':
    case '/config/webExtensions.json':
    case '/config/fileMap.json':
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
  const sharedProcess = fork(
    sharedProcessPath,
    // execArgv: ['--trace-deopt'],
    ['--enable-source-maps', '--ipc-type=node-forked-process', ...argvSliced],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
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
          {
            jsonrpc: '2.0',
            method: 'HandleWebSocket.handleWebSocket',
            params: [
              {
                headers: request.headers,
                method: request.method,
              },
            ],
          },
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
        {
          jsonrpc: '2.0',
          method: 'HandleWebSocket.handleWebSocket',
          params: [
            {
              headers: request.headers,
              method: request.method,
            },
          ],
        },
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
  if (error && error.code === ErrorCodes.EADDRINUSE) {
    console.error(`[server] Error: port ${PORT} is already taken (possible solution: Run \`killall node\` to free up the port)`)
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
  app.on('listening', handleAppReady)
  if (isPublic) {
    app.listen(PORT)
  } else {
    app.listen(PORT, 'localhost')
  }
}

main()
