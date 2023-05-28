import { jest } from '@jest/globals'
import { AssertionError } from '../src/parts/AssertionError/AssertionError.js'
import { CommandNotFoundError } from '../src/parts/CommandNotFoundError/CommandNotFoundError.js'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'
import { VError } from '../src/parts/VError/VError.js'

jest.unstable_mockModule('node:fs', () => ({
  readFileSync: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => ({
  warn: jest.fn(() => {}),
}))

const fs = await import('node:fs')
const PrettyError = await import('../src/parts/PrettyError/PrettyError.js')

test('prepare - module not found error', async () => {
  const error = new Error()
  error.message = `[ERR_MODULE_NOT_FOUND]: Cannot find package 'vscode-ripgrep-with-github-api-error-fix' imported from /test/packages/shared-process/src/parts/RgPath/RgPath.js`
  error.stack = `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vscode-ripgrep-with-github-api-error-fix' imported from /test/packages/shared-process/src/parts/RgPath/RgPath.js
    at __node_internal_captureLargerStackTrace (node:internal/errors:477:5)
    at new NodeError (node:internal/errors:387:5)
    at packageResolve (node:internal/modules/esm/resolve:957:9)
    at moduleResolve (node:internal/modules/esm/resolve:1006:20)
    at defaultResolve (node:internal/modules/esm/resolve:1220:11)
    at nextResolve (node:internal/modules/esm/loader:165:28)
    at ESMLoader.resolve (node:internal/modules/esm/loader:844:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:431:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:40)
    at link (node:internal/modules/esm/module_job:75:36)
    at loadCommand`
  // @ts-ignore
  error.code = ErrorCodes.ERR_MODULE_NOT_FOUND
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `export { rgPath } from 'vscode-ripgrep-with-github-api-error-fix121'`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: `[ERR_MODULE_NOT_FOUND]: Cannot find package 'vscode-ripgrep-with-github-api-error-fix' imported from /test/packages/shared-process/src/parts/RgPath/RgPath.js`,
    stack: `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vscode-ripgrep-with-github-api-error-fix' imported from /test/packages/shared-process/src/parts/RgPath/RgPath.js
    at /test/packages/shared-process/src/parts/RgPath/RgPath.js:1:24
    at __node_internal_captureLargerStackTrace (node:internal/errors:477:5)
    at new NodeError (node:internal/errors:387:5)
    at packageResolve (node:internal/modules/esm/resolve:957:9)
    at moduleResolve (node:internal/modules/esm/resolve:1006:20)
    at defaultResolve (node:internal/modules/esm/resolve:1220:11)
    at nextResolve (node:internal/modules/esm/loader:165:28)
    at ESMLoader.resolve (node:internal/modules/esm/loader:844:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:431:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:40)
    at link (node:internal/modules/esm/module_job:75:36)
    at loadCommand`,
    codeFrame: `
> 1 | export { rgPath } from 'vscode-ripgrep-with-github-api-error-fix121'
    |                        ^`.trim(),
  })
})

test('prepare - maximum call stack size exceeded', async () => {
  const error = new RangeError('Maximum call stack size exceeded')
  error.stack = `RangeError: Maximum call stack size exceeded
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:3)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `import { spawn } from 'node:child_process'
import { once } from 'node:events'
import * as ExecPromise from '../ExecPromise/ExecPromise.js'
import * as Hash from '../Hash/Hash.js'

export const execCommand = async (command, args, options) => {
  const { stdout, stderr } = await ExecPromise.execPromise(command, args, options)
  return {
    stdout,
    stderr,
  }
}

export const execCommandHash = async (command, args, options) => {
  const child = spawn(command, args, options)
  const hash = Hash.createHash('sha1')
  child.stdout.pipe(hash)
  await once(child, 'exit')
  const finalHash = hash.digest('hex')
  return finalHash
}

export const execSync = (command) => {
  return execSync(command).toString().trim()
}
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'Maximum call stack size exceeded',
    stack: `  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:3)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)
  at execSync (test:///test/packages/shared-process/src/parts/ExecCommand/ExecCommand.js:24:10)`,
    codeFrame: `  22 |
  23 | export const execSync = (command) => {
> 24 |   return execSync(command).toString().trim()
     |   ^
  25 | }
  26 |`,
    type: 'RangeError',
  })
})

test('prepare - ReferenceError - exports is not defined in ES module scope', async () => {
  const error = new ReferenceError(`exports is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/test/packages/shared-process/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.`)
  error.stack = `ReferenceError: exports is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/test/packages/shared-process/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
    at test:///test/packages/shared-process/src/parts/IpcParentWithNodeWorker/IpcParentWithNodeWorker.js:5:1
    at ModuleJob.run (node:internal/modules/esm/module_job:193:25)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:530:24)
    at async Module.create (test:///test/packages/shared-process/src/parts/IpcParent/IpcParent.js:4:18)
    at async createPtyHost (test:///test/packages/shared-process/src/parts/Terminal/Terminal.js:52:19)
    at async Module.create (test:///test/packages/shared-process/src/parts/Terminal/Terminal.js:79:23)'`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `import * as Assert from '../Assert/Assert.js'
import { Worker } from 'node:worker_threads'
import * as GetFirstNodeWorkerEvent from '../GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js'

exports.create = async ({ path, argv, env, execArgv }) => {
  Assert.string(path)
  const worker = new Worker(path, {
    argv,
    env,
    execArgv,
  })
  const { type, event } = await GetFirstNodeWorkerEvent.getFirstNodeWorkerEvent(worker)
  return worker
}

exports.wrap = (worker) => {
  return {
    worker,
    on(event, listener) {
      this.worker.on(event, listener)
    },
    send(message) {
      this.worker.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      this.worker.postMessage(message, transfer)
    },
    dispose() {
      this.worker.terminate()
    },
  }
}
`
  })
  const prettyError = PrettyError.prepare(error)
  // TODO error message could be shorter
  expect(prettyError).toEqual({
    message: `exports is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/test/packages/shared-process/package.json' contains \"type\": \"module\". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.`,
    stack: `    at test:///test/packages/shared-process/src/parts/IpcParentWithNodeWorker/IpcParentWithNodeWorker.js:5:1
    at async create (test:///test/packages/shared-process/src/parts/IpcParent/IpcParent.js:4:18)
    at async createPtyHost (test:///test/packages/shared-process/src/parts/Terminal/Terminal.js:52:19)
    at async create (test:///test/packages/shared-process/src/parts/Terminal/Terminal.js:79:23)'`,
    codeFrame: `  3 | import * as GetFirstNodeWorkerEvent from '../GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js'
  4 |
> 5 | exports.create = async ({ path, argv, env, execArgv }) => {
    | ^
  6 |   Assert.string(path)
  7 |   const worker = new Worker(path, {
  8 |     argv,`,
    type: 'ReferenceError',
  })
})

test('prepare - Error - the "streams[stream.length-1]" property must be of type function', async () => {
  const error = new TypeError(`The "streams[stream.length - 1]" property must be of type function. Received an instance of Transform`)
  // @ts-ignore
  error.code = 'ERR_INVALID_ARG_TYPE'
  error.stack = `TypeError [ERR_INVALID_ARG_TYPE]: The "streams[stream.length - 1]" property must be of type function. Received an instance of Transform
    at popCallback (node:internal/streams/pipeline:68:3)
    at pipeline (node:internal/streams/pipeline:151:37)
    at Object.search [as TextSearch.search] (test:///packages/shared-process/src/parts/TextSearch/TextSearch.js:88:3)
    at executeCommandAsync (test:///packages/shared-process/src/parts/Command/Command.js:67:33)
    at async Module.getResponse (test:///packages/shared-process/src/parts/GetResponse/GetResponse.js:13:9)
    at async WebSocket.handleMessage (test:///packages/shared-process/src/parts/Socket/Socket.js:32:22)`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `import { pipeline, Transform } from 'stream'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.js'
import * as GetTextSearchRipGrepArgs from '../GetTextSearchRipGrepArgs/GetTextSearchRipGrepArgs.js'
import * as RipGrep from '../RipGrep/RipGrep.js'
import * as RipGrepParsedLineType from '../RipGrepParsedLineType/RipGrepParsedLineType.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as ToTextSearchResult from '../ToTextSearchResult/ToTextSearchResult.js'
// TODO update vscode-ripgrep when https://github.com/mhinz/vim-grepper/issues/244, https://github.com/BurntSushi/ripgrep/issues/1892 is fixed

// need to use '.' as last argument for ripgrep
// issue 1 https://github.com/nvim-telescope/telescope.nvim/pull/908/files
// issue 2 https://github.com/BurntSushi/ripgrep/issues/1892
// remove workaround when ripgrep is fixed

// TODO stats flag might not be necessary
// TODO update client
// TODO not always run nice, maybe configure nice via flag/options

export const search = async (searchDir, searchString, { threads = 1, maxSearchResults = 20_000, isCaseSensitive = false } = {}) => {
  const ripGrepArgs = GetTextSearchRipGrepArgs.getRipGrepArgs({
    threads,
    isCaseSensitive,
    searchString,
  })
  const childProcess = RipGrep.spawn(ripGrepArgs, {
    cwd: searchDir,
  })
  const allSearchResults = Object.create(null)
  let buffer = ''
  let stats = {}
  let limitHit = false
  let numberOfResults = 0

  childProcess.stdout.setEncoding(EncodingType.Utf8)

  const handleLine = (line) => {
    const parsedLine = JSON.parse(line)
    switch (parsedLine.type) {
      case RipGrepParsedLineType.Begin:
        allSearchResults[parsedLine.data.path.text] = [
          {
            type: TextSearchResultType.File,
            start: 0,
            end: 0,
            lineNumber: 0,
            text: parsedLine.data.path.text,
          },
        ]
        break
      case RipGrepParsedLineType.Match:
        numberOfResults++
        allSearchResults[parsedLine.data.path.text].push(...ToTextSearchResult.toTextSearchResult(parsedLine))
        break
      case RipGrepParsedLineType.Summary:
        stats = parsedLine.data
        break
      default:
        break
    }
  }

  let total = 0
  const handleData = (chunk) => {
    let newLineIndex = GetNewLineIndex.getNewLineIndex(chunk)
    const dataString = buffer + chunk
    if (newLineIndex === -1) {
      buffer = dataString
      return
    }
    total += chunk.length
    newLineIndex += buffer.length
    let previousIndex = 0
    while (newLineIndex >= 0) {
      const line = dataString.slice(previousIndex, newLineIndex)
      handleLine(line)
      previousIndex = newLineIndex + 1
      newLineIndex = GetNewLineIndex.getNewLineIndex(dataString, previousIndex)
    }
    buffer = dataString.slice(previousIndex)

    if (numberOfResults > maxSearchResults) {
      limitHit = true
      childProcess.kill()
    }
  }

  pipeline(
    childProcess.stdout,
    new Transform({
      decodeStrings: false,
      construct(callback) {
        callback()
      },
      transform(chunk, encoding, callback) {
        handleData(chunk)
        callback()
      },
      flush(callback) {
        callback()
      },
    })
  )

  // childProcess.stdout.on('data', handleData)

  // TODO reject promise when ripgrep search fails
  return new Promise((resolve, reject) => {
    // TODO use pipeline / transform stream maybe

    const handleClose = () => {
      const results = Object.values(allSearchResults).flat(1)
      resolve({
        results,
        stats,
        limitHit,
      })
    }
    const handleError = (error) => {
      // TODO check type of error
      console.error(error)
      resolve({
        results: [],
        stats,
        limitHit,
      })
    }

    childProcess.once('close', handleClose)
    childProcess.once('error', handleError)
  })
}
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'The "streams[stream.length - 1]" property must be of type function. Received an instance of Transform',
    stack: `    at TextSearch.search (test:///packages/shared-process/src/parts/TextSearch/TextSearch.js:88:3)`,
    codeFrame: `  86 |   }
  87 |
> 88 |   pipeline(
     |   ^
  89 |     childProcess.stdout,
  90 |     new Transform({
  91 |       decodeStrings: false,`,
    type: 'TypeError',
    code: 'ERR_INVALID_ARG_TYPE',
  })
})

test('prepare - AssertionError', async () => {
  const error = new AssertionError(`expected value to be of type string`)
  error.stack = `AssertionError: expected value to be of type string
    at Module.string (test:///test/packages/shared-process/src/parts/Assert/Assert.js:50:11)
    at Object.getColorThemeJson [as ExtensionHost.getColorThemeJson] (test:///test/packages/shared-process/src/parts/ExtensionManagement/ExtensionManagementColorTheme.js:32:10)
    at executeCommandAsync (test:///test/packages/shared-process/src/parts/Command/Command.js:68:33)
    at async Module.getResponse (test:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:9)
    at async WebSocket.handleMessage (test:///test/packages/shared-process/src/parts/Socket/Socket.js:32:22)`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `import VError from 'verror'
import * as Assert from '../Assert/Assert.js'
import * as Error from '../Error/Error.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as FileSystemWatch from '../FileSystemWatch/FileSystemWatch.js'
import * as ReadJson from '../JsonFile/JsonFile.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as Path from '../Path/Path.js'
import * as Process from '../Process/Process.js'
import * as ExtensionManagement from './ExtensionManagement.js'

// TODO test this function
// TODO very similar with getIconTheme

const getColorThemePath = async (extensions, colorThemeId) => {
  for (const extension of extensions) {
    if (!extension.colorThemes) {
      continue
    }
    for (const colorTheme of extension.colorThemes) {
      if (colorTheme.id !== colorThemeId) {
        continue
      }
      const absolutePath = Path.join(extension.path, colorTheme.path)
      return absolutePath
    }
  }
  return ''
}

export const getColorThemeJson = async (colorThemeId) => {
  Assert.string(colorThemeId)
  const extensions = await ExtensionManagement.getExtensions()
  const colorThemePath = await getColorThemePath(extensions, colorThemeId)
  if (!colorThemePath) {
    throw new Error.OperationalError({
      code: ErrorCodes.E_COLOR_THEME_NOT_FOUND,
      message: \`Color theme "\${colorThemeId}" not found in extensions folder\`,
    })
  }
  try {
    const json = await ReadJson.readJson(colorThemePath)
    return json
  } catch (error) {
    throw new VError(error, \`Failed to load color theme "\${colorThemeId}"\`)
  }
}

const getColorThemeInfo = (extension) => {
  return extension.colorThemes || []
}

const getExtensionColorThemeNames = (extension) => {
  return extension.colorThemes || []
}

const getColorThemeId = (colorTheme) => {
  return colorTheme.id
}

// TODO should send names to renderer worker or names with ids?
export const getColorThemeNames = async () => {
  const extensions = await ExtensionManagement.getExtensions()
  const colorThemes = extensions.flatMap(getExtensionColorThemeNames)
  const colorThemeNames = colorThemes.map(getColorThemeId)
  return colorThemeNames
}

export const getColorThemes = async () => {
  const extensions = await ExtensionManagement.getExtensions()
  const colorThemes = extensions.flatMap(getColorThemeInfo)
  return colorThemes
}

export const watch = async (socket, colorThemeId) => {
  // console.log({ socket, colorThemeId })
  const extensions = await ExtensionManagement.getExtensions()
  const colorThemePath = await getColorThemePath(extensions, colorThemeId)
  const verbose = Process.argv.includes('--verbose')
  if (verbose) {
    console.info(\`[shared-process] starting to watch color theme \${colorThemeId} at \${colorThemePath}\`)
  }
  const watcher = FileSystemWatch.watchFile(colorThemePath)
  for await (const event of watcher) {
    socket.send({ jsonrpc: JsonRpcVersion.Two, method: 'ColorTheme.reload', params: [] })
  }
}
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'expected value to be of type string',
    stack: `    at ExtensionHost.getColorThemeJson (test:///test/packages/shared-process/src/parts/ExtensionManagement/ExtensionManagementColorTheme.js:32:10)`,
    codeFrame: `  30 |
  31 | export const getColorThemeJson = async (colorThemeId) => {
> 32 |   Assert.string(colorThemeId)
     |          ^
  33 |   const extensions = await ExtensionManagement.getExtensions()
  34 |   const colorThemePath = await getColorThemePath(extensions, colorThemeId)
  35 |   if (!colorThemePath) {`,
    type: 'AssertionError',
  })
})

test('prepare - CommandNotFoundError', async () => {
  const cause = new CommandNotFoundError(`Search.saerchFile`)
  const error = new VError(cause, `Failed to load command Search.searchFile`)
  error.stack = `VError: Failed to load command Search.searchFile: CommandNotFoundError: command Search.searchFile not found
    at Module.getModuleId (test:///test/packages/shared-process/src/parts/ModuleMap/ModuleMap.js:147:13)
    at loadCommand (test:///test/packages/shared-process/src/parts/Command/Command.js:46:35)
    at executeCommandAsync (test:///test/packages/shared-process/src/parts/Command/Command.js:57:11)
    at Module.execute (test:///test/packages/shared-process/src/parts/Command/Command.js:75:10)
    at Module.getResponse (test:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:23)
    at WebSocket.handleMessage (test:///test/packages/shared-process/src/parts/Socket/Socket.js:27:40)
    at callListener (/test/packages/shared-process/node_modules/ws/lib/event-target.js:290:14)
    at WebSocket.onMessage (/test/packages/shared-process/node_modules/ws/lib/event-target.js:209:9)
    at WebSocket.emit (node:events:513:28)
    at Receiver.receiverOnMessage (/test/packages/shared-process/node_modules/ws/lib/websocket.js:1180:20)`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as ModuleId from '../ModuleId/ModuleId.js'

export const getModuleId = (commandId) => {
  switch (commandId) {
    case 'BulkReplacement.applyBulkReplacement':
      return ModuleId.BulkReplacement
    case 'ChromeExtension.install':
    case 'ChromeExtension.uninstall':
      return ModuleId.ChromeExtension
    case 'ClipBoard.readFiles':
    case 'ClipBoard.writeFiles':
      return ModuleId.ClipBoard
    case 'Developer.allocateMemory':
    case 'Developer.crashSharedProcess':
    case 'Developer.createHeapSnapshot':
    case 'Developer.createProfile':
    case 'Developer.getNodeStartupTime':
    case 'Developer.getNodeStartupTiming':
    case 'Developer.sharedProcessMemoryUsage':
    case 'Developer.sharedProcessStartupPerformance':
      return ModuleId.Developer
    case 'Download.download':
      return ModuleId.Download
    case 'ExtensionHost.dispose':
    case 'ExtensionHost.enableExtension':
    case 'ExtensionHost.executeCommand':
    case 'ExtensionHost.executeTabCompletionProvider':
    case 'ExtensionHost.format':
    case 'ExtensionHost.getMemoryUsage':
    case 'ExtensionHost.getSourceControlBadgeCount':
    case 'ExtensionHost.getStatusBarItems':
    case 'ExtensionHost.registerChangeListener':
    case 'ExtensionHost.setWorkspacePath':
    case 'ExtensionHost.sourceControlGetChangedFiles':
    case 'ExtensionHost.start':
    case 'ExtensionHostBraceCompletion.executeBraceCompletionProvider':
    case 'ExtensionHostClosingTag.execute':
    case 'ExtensionHostClosingTag.executeClosingTagProvider':
    case 'ExtensionHostClosingTag.executeTypeDefinitionProvider':
    case 'ExtensionHostCompletion.execute':
    case 'ExtensionHostDefinition.executeDefinitionProvider':
    case 'ExtensionHostDiagnostic.execute':
    case 'ExtensionHostFileSystem.getPathSeparator':
    case 'ExtensionHostFileSystem.readDirWithFileTypes':
    case 'ExtensionHostFileSystem.readFile':
    case 'ExtensionHostFileSystem.remove':
    case 'ExtensionHostFileSystem.rename':
    case 'ExtensionHostFileSystem.writeFile':
    case 'ExtensionHostHover.execute':
    case 'ExtensionHostImplementation.executeImplementationProvider':
    case 'ExtensionHostKeyBindings.getKeyBindings':
    case 'ExtensionHostLanguages.getLanguages':
    case 'ExtensionHostManagement.activateAll':
    case 'ExtensionHostManagement.enableExtensions':
    case 'ExtensionHostOutput.getOutputChannels':
    case 'ExtensionHostQuickPick.handleQuickPickResult':
    case 'ExtensionHostReferences.executeReferenceProvider':
    case 'EXtensionHostRename.executePrepareRename':
    case 'ExtensionHostRename.executeRename':
    case 'ExtensionHostSemanticTokens.executeSemanticTokenProvider':
    case 'ExtensionHostSourceControl.acceptInput':
    case 'ExtensionHostTextDocument.setLanguageId':
    case 'ExtensionHostTextDocument.syncFull':
    case 'ExtensionHostTextDocument.syncIncremental':
    case 'ExtensionHostTextDocument.syncInitial':
    case 'ExtensionHostTextDocument':
    case 'ExtensionHostWorkspace.setWorkspacePath':
      return ModuleId.ExtensionHost
    case 'ExtensionHost.getColorThemeJson':
    case 'ExtensionHost.getColorThemeNames':
    case 'ExtensionHost.getColorThemes':
    case 'ExtensionHost.getIconTheme':
    case 'ExtensionHost.getIconThemeJson':
    case 'ExtensionHost.getLanguageConfiguration':
    case 'ExtensionHost.getLanguages':
    case 'ExtensionHost.watchColorTheme':
    case 'ExtensionManagement.disable':
    case 'ExtensionManagement.enable':
    case 'ExtensionManagement.getAllExtensions':
    case 'ExtensionManagement.getExtensions':
    case 'ExtensionManagement.install':
    case 'ExtensionManagement.uninstall':
      return ModuleId.ExtensionManagement
    case 'FileSystem.chmod':
    case 'FileSystem.copy':
    case 'FileSystem.createFile':
    case 'FileSystem.createFolder':
    case 'FileSystem.ensureFile':
    case 'FileSystem.getPathSeparator':
    case 'FileSystem.mkdir':
    case 'FileSystem.readDirWithFileTypes':
    case 'FileSystem.readFile':
    case 'FileSystem.remove':
    case 'FileSystem.rename':
    case 'FileSystem.writeFile':
      return ModuleId.FileSystem
    case 'GitLsFiles.gitLsFiles':
    case 'GitLsFiles.gitLsFilesHash':
    case 'GitLsFiles.resolveGit':
      return ModuleId.GitLsFiles
    case 'Native.openFolder':
      return ModuleId.Native
    case 'OutputChannel.close':
    case 'OutputChannel.open':
      return ModuleId.OutputChannel
    case 'Platform.getAppDir':
    case 'Platform.getBuiltinExtensionsPath':
    case 'Platform.getCachedExtensionsPath':
    case 'Platform.getCacheDir':
    case 'Platform.getConfigDir':
    case 'Platform.getDataDir':
    case 'Platform.getDisabledExtensionsPath':
    case 'Platform.getDownloadDir':
    case 'Platform.getExtensionsPath':
    case 'Platform.getHomeDir':
    case 'Platform.getLogsDir':
    case 'Platform.getMarketplaceUrl':
    case 'Platform.getRecentlyOpenedPath':
    case 'Platform.getTestPath':
    case 'Platform.getUserSettingsPath':
    case 'Platform.setEnvironmentVariables':
      return ModuleId.Platform
    case 'Preferences.getAll':
      return ModuleId.Preferences
    case 'RecentlyOpened.addPath':
      return ModuleId.RecentlyOpened
    case 'TextSearch.search':
      return ModuleId.Search
    case 'SearchFile.searchFile':
      return ModuleId.SearchFile
    case 'Terminal.create':
    case 'Terminal.dispose':
    case 'Terminal.resize':
    case 'Terminal.write':
      return ModuleId.Terminal
    case 4820:
      return ModuleId.TextDocument
    case 'WebSocketServer.handleUpgrade':
      return ModuleId.WebSocketServer
    case 'Workspace.getHomeDir':
    case 'Workspace.resolveRoot':
      return ModuleId.Workspace
    case 'InstallExtension.installExtension':
      return ModuleId.InstallExtension
    default:
      throw new CommandNotFoundError(commandId)
  }
}
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'Failed to load command Search.searchFile: CommandNotFoundError: command Search.saerchFile not found in shared process',
    stack: `    at getModuleId (test:///test/packages/shared-process/src/parts/ModuleMap/ModuleMap.js:147:13)
    at loadCommand (test:///test/packages/shared-process/src/parts/Command/Command.js:46:35)
    at execute (test:///test/packages/shared-process/src/parts/Command/Command.js:75:10)
    at getResponse (test:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:23)
    at WebSocket.handleMessage (test:///test/packages/shared-process/src/parts/Socket/Socket.js:27:40)`,
    codeFrame: `  145 |       return ModuleId.InstallExtension
  146 |     default:
> 147 |       throw new CommandNotFoundError(commandId)
      |             ^
  148 |   }
  149 | }
  150 |`,
    type: 'VError',
    code: 'E_COMMAND_NOT_FOUND',
  })
})

test('prepare - terminal error', async () => {
  const error = new VError(`Failed to create terminal: AssertionError: expected value to be of type object`)
  error.stack = `VError: Failed to create terminal: AssertionError: expected value to be of type object
    at Module.object (test:///test/packages/shared-process/src/parts/Assert/Assert.js:29:11)
    at Object.create [as Terminal.create] (test:///test/packages/shared-process/src/parts/Terminal/Terminal.js:12:12)
    at executeCommandAsync (test:///test/packages/shared-process/src/parts/Command/Command.js:68:33)
    at async Module.getResponse (test:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:9:9)
    at async handleJsonRpcMessage (test:///test/packages/shared-process/src/parts/HandleIpc/HandleIpc.js:12:24)`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `import * as Assert from '../Assert/Assert.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as PtyHost from '../PtyHost/PtyHost.js'
import { VError } from '../VError/VError.js'

export const state = {
  socketMap: Object.create(null),
}

export const create = async (socket, id, cwd) => {
  try {
    Assert.object(socket)
    Assert.number(id)
    Assert.string(cwd)
    // TODO dispose entry
    state.socketMap[id] = socket
    const ptyHost = await PtyHost.getOrCreate()

    const handleMessage = (message) => {
      socket.send(message)
    }
    const handleClose = () => {
      // socket.off('close', handleClose)
      ptyHost.off('message', handleMessage)
      ptyHost.dispose()
    }
    ptyHost.on('message', handleMessage)
    socket.on('close', handleClose)

    // TODO use invoke
    ptyHost.send({
      jsonrpc: JsonRpcVersion.Two,
      method: 'Terminal.create',
      params: [id, cwd],
    })
  } catch (error) {
    throw new VError(error, \`Failed to create terminal\`)
  }
}

export const write = (id, data) => {
  Assert.number(id)
  Assert.string(data)
  const ptyHost = PtyHost.getCurrentInstance()
  if (!ptyHost) {
    console.log('[shared-process] pty host not ready')
    return
  }
  // TODO should use invoke
  ptyHost.send({
    jsonrpc: JsonRpcVersion.Two,
    method: 'Terminal.write',
    params: [id, data],
  })
}

export const resize = (state, columns, rows) => {
  // state.pty.resize(columns, rows)
}

export const dispose = async (id) => {
  const ptyHost = await PtyHost.getOrCreate()
  // TODO use invoke
  ptyHost.send({
    jsonrpc: JsonRpcVersion.Two,
    method: 'Terminal.dispose',
    params: [id],
  })
}

export const disposeAll = () => {
  PtyHost.disposeAll()
}
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'Failed to create terminal: AssertionError: expected value to be of type object',
    stack: `    at Terminal.create (test:///test/packages/shared-process/src/parts/Terminal/Terminal.js:12:12)
    at async handleJsonRpcMessage (test:///test/packages/shared-process/src/parts/HandleIpc/HandleIpc.js:12:24)`,
    codeFrame: `  10 | export const create = async (socket, id, cwd) => {
  11 |   try {
> 12 |     Assert.object(socket)
     |            ^
  13 |     Assert.number(id)
  14 |     Assert.string(cwd)
  15 |     // TODO dispose entry`,
    type: 'VError',
  })
})
