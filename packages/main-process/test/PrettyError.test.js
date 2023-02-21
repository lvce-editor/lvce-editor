beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('node:fs', () => ({
  readFileSync: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const fs = require('node:fs')
const PrettyError = require('../src/parts/PrettyError/PrettyError.js')

test('prepare - unknown command error', async () => {
  const error = new Error()
  error.message = 'Unknown command "ElectronWindowAbout.open"'
  error.stack = `  at exports.invoke (/test/packages/main-process/src/parts/Command/Command.js:64:13)
  at async exports.getResponse (/test/packages/main-process/src/parts/GetResponse/GetResponse.js:7:20)
  at async MessagePortMain.handleMessage (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:179:22)`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `const Module = require('../Module/Module.js')
const ModuleMap = require('../ModuleMap/ModuleMap.js')

const commands = Object.create(null)
const pendingModules = Object.create(null)

const initializeModule = (module) => {
  if (module.Commands) {
    for (const [key, value] of Object.entries(module.Commands)) {
      if (module.name) {
        const actualKey = \`\${module.name}.\${key}\`
        register(actualKey, value)
      } else {
        register(key, value)
      }
    }
    return
  }
  throw new Error(\`module \${module.name} is missing commands\`)
}

const getOrLoadModule = (moduleId) => {
  if (!pendingModules[moduleId]) {
    const importPromise = Module.load(moduleId)
    pendingModules[moduleId] = importPromise.then(initializeModule)
  }
  return pendingModules[moduleId]
}

const loadCommand = (command) => getOrLoadModule(ModuleMap.getModuleId(command))

const register = (exports.register = (commandId, listener) => {
  commands[commandId] = listener
})

const hasThrown = new Set()

const loadThenExecute = async (command, ...args) => {
  await loadCommand(command)
  // TODO can skip then block in prod (only to prevent endless loop in dev)
  if (!(command in commands)) {
    if (hasThrown.has(command)) {
      return
    }
    hasThrown.add(command)
    throw new Error(\`Command did not register "\${command}"\`)
  }
  return execute(command, ...args)
}

const execute = (command, ...args) => {
  if (command in commands) {
    return commands[command](...args)
  }
  return loadThenExecute(command, ...args)
}

exports.execute = execute

exports.invoke = async (command, ...args) => {
  if (!(command in commands)) {
    await loadCommand(command)
    if (!(command in commands)) {
      throw new Error(\`Unknown command "\${command}"\`)
    }
  }
  return commands[command](...args)
}

`
  })
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'Unknown command "ElectronWindowAbout.open"',
    stack: `  at exports.invoke (/test/packages/main-process/src/parts/Command/Command.js:64:13)
  at async exports.getResponse (/test/packages/main-process/src/parts/GetResponse/GetResponse.js:7:20)
  at async MessagePortMain.handleMessage (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:179:22)`,
    codeFrame: `  62 |     await loadCommand(command)
  63 |     if (!(command in commands)) {
> 64 |       throw new Error(\`Unknown command "\${command}"\`)
     |             ^
  65 |     }
  66 |   }
  67 |   return commands[command](...args)`,
    type: 'Error',
  })
})

test('prepare - electron error', async () => {
  const error = new TypeError('Invalid Menu')
  error.stack = `  at node:electron/js2c/browser_init:2:37794
  at Array.map (<anonymous>)
  at a.setApplicationMenu (node:electron/js2c/browser_init:2:37784)
  at exports.createAppWindow (/test/packages/main-process/src/parts/AppWindow/AppWindow.js:84:17)
  at async handleReady (/test/packages/main-process/src/parts/App/App.js:40:3)
  at async exports.hydrate (/test/packages/main-process/src/parts/App/App.js:132:3)
  at async main (/test/packages/main-process/src/mainProcessMain.js:16:3)`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `const VError = require('verror')
const Screen = require('../ElectronScreen/ElectronScreen.js')
const Window = require('../ElectronWindow/ElectronWindow.js')
const Performance = require('../Performance/Performance.js')
const LifeCycle = require('../LifeCycle/LifeCycle.js')
const Session = require('../ElectronSession/ElectronSession.js')
const Platform = require('../Platform/Platform.js')
const Preferences = require('../Preferences/Preferences.js')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const Logger = require('../Logger/Logger.js')
const Electron = require('electron')
const AppWindowTitleBar = require('../AppWindowTitleBar/AppWindowTitleBar.js')

// TODO impossible to test these methods
// and ensure that there is no memory leak
/**
 * @param {import('electron').Event} event
 */
const handleWindowClose = (event) => {
  const id = event.sender.id
  AppWindowStates.remove(id)
}

const loadUrl = async (browserWindow, url) => {
  Performance.mark('code/willLoadUrl')
  try {
    await browserWindow.loadURL(url)
  } catch (error) {
    if (LifeCycle.isShutDown()) {
      Logger.info('error during shutdown', error)
    } else {
      throw new VError(
        // @ts-ignore
        error,
        \`Failed to load window url "\${url}"\`
      )
    }
  }
  Performance.mark('code/didLoadUrl')
}

const defaultUrl = \`\${Platform.scheme}://-\`

// TODO avoid mixing BrowserWindow, childprocess and various lifecycle methods in one file -> separate concerns
exports.createAppWindow = async (
  parsedArgs,
  workingDirectory,
  url = defaultUrl
) => {
  const preferences = await Preferences.load()
  const titleBarPreference = Preferences.get(
    preferences,
    'window.titleBarStyle'
  )
  const frame = titleBarPreference === 'custom' ? false : true
  const titleBarStyle = titleBarPreference === 'custom' ? 'hidden' : undefined
  const zoomLevelPreference = Preferences.get(preferences, 'window.zoomLevel')
  const zoomLevel = zoomLevelPreference
  const windowControlsOverlayPreference =
    Platform.isWindows &&
    Preferences.get(preferences, 'window.controlsOverlay.enabled')
  const titleBarOverlay = windowControlsOverlayPreference
    ? {
        color: '#1e2324',
        symbolColor: '#74b1be',
        height: 29,
      }
    : undefined
  const session = Session.get()
  const window = Window.create({
    y: 0,
    x: Screen.getWidth() - 800,
    width: 800,
    height: Screen.getHeight(),
    menu: true,
    background: '#1e2324',
    session,
    titleBarStyle,
    frame,
    zoomLevel,
    titleBarOverlay,
  })
  const menu = AppWindowTitleBar.createTitleBar()
  Electron.Menu.setApplicationMenu(menu)

  // window.setMenu(menu)
  window.setMenuBarVisibility(true)
  window.setAutoHideMenuBar(false)
  window.on('close', handleWindowClose)
  AppWindowStates.add({
    window,
    parsedArgs,
    workingDirectory,
    id: window.id,
  })
  await loadUrl(window, url)
}

exports.openNew = (url) => {
  return exports.createAppWindow([], '', url)
}

exports.findById = (id) => {
  return AppWindowStates.findById(id)
}


`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'Invalid Menu',
    stack: `  at exports.createAppWindow (/test/packages/main-process/src/parts/AppWindow/AppWindow.js:84:17)
  at async handleReady (/test/packages/main-process/src/parts/App/App.js:40:3)
  at async exports.hydrate (/test/packages/main-process/src/parts/App/App.js:132:3)
  at async main (/test/packages/main-process/src/mainProcessMain.js:16:3)`,
    codeFrame: `  82 |   })
  83 |   const menu = AppWindowTitleBar.createTitleBar()
> 84 |   Electron.Menu.setApplicationMenu(menu)
     |                 ^
  85 |
  86 |   // window.setMenu(menu)
  87 |   window.setMenuBarVisibility(true)`,
    type: 'TypeError',
  })
})

test('prepare - module not found error', async () => {
  const error = new Error(`Cannot find module '../ElectronApplicationMenu/ElectronApplicationMenu.ipc.js/index.js.js'
Require stack:
- /test/packages/main-process/src/parts/Module/Module.js
- /test/packages/main-process/src/mainProcessMain.js
- /test/packages/main-process/node_modules/electron/dist/resources/default_app.asar/main.js`)
  error.stack = `Error: Cannot find module '../ElectronApplicationMenu/ElectronApplicationMenu.ipc.js/index.js.js'
Require stack:
- /test/packages/main-process/src/parts/Module/Module.js
- /test/packages/main-process/src/mainProcessMain.js
- /test/packages/main-process/node_modules/electron/dist/resources/default_app.asar/main.js
-
    at Module._resolveFilename (node:internal/modules/cjs/loader:963:15)
    at n._resolveFilename (node:electron/js2c/browser_init:2:109416)
    at Module._load (node:internal/modules/cjs/loader:811:27)
    at f._load (node:electron/js2c/asar_bundle:2:13328)
    at Module.require (node:internal/modules/cjs/loader:1035:19)
    at require (node:internal/modules/cjs/helpers:102:18)
    at exports.load (/test/packages/main-process/src/parts/Module/Module.js:42:14)
    at getOrLoadModule (/test/packages/main-process/src/parts/Command/Command.js:26:33)
    at loadCommand (/test/packages/main-process/src/parts/Command/Command.js:32:34)
    at exports.invoke (/test/packages/main-process/src/parts/Command/Command.js:64:11)`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `const ModuleId = require('../ModuleId/ModuleId.js')

exports.load = async (moduleId) => {
  switch (moduleId) {
    case ModuleId.App:
      return require('../App/App.ipc.js')
    case ModuleId.AppWindow:
      return require('../AppWindow/AppWindow.ipc.js')
    case ModuleId.Beep:
      return require('../ElectronBeep/ElectronBeep.js')
    case ModuleId.ElectronBrowserView:
      return require('../ElectronBrowserView/ElectronBrowserView.ipc.js')
    case ModuleId.ElectronBrowserViewFunctions:
      return require('../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.ipc.js')
    case ModuleId.ElectronBrowserViewQuickPick:
      return require('../ElectronBrowserViewQuickPick/ElectronBrowserViewQuickPick.ipc.js')
    case ModuleId.ElectronClipBoard:
      return require('../ElectronClipBoard/ElectronClipBoard.ipc.js')
    case ModuleId.ElectronContentTracing:
      return require('../ElectronContentTracing/ElectronContentTracing.ipc.js')
    case ModuleId.ElectronContextMenu:
      return require('../ElectronContextMenu/ElectronContextMenu.ipc.js/index.js')
    case ModuleId.Developer:
      return require('../ElectronDeveloper/ElectronDeveloper.ipc.js')
    case ModuleId.Dialog:
      return require('../ElectronDialog/ElectronDialog.ipc.js')
    case ModuleId.ElectronNetLog:
      return require('../ElectronNetLog/ElectronNetLog.ipc.js')
    case ModuleId.ElectronPowerSaveBlocker:
      return require('../ElectronPowerSaveBlocker/ElectronPowerSaveBlocker.ipc.js')
    case ModuleId.ElectronSafeStorage:
      return require('../ElectronSafeStorage/ElectronSafeStorage.ipc.js')
    case ModuleId.ElectronShell:
      return require('../ElectronShell/ElectronShell.ipc.js')
    case ModuleId.Window:
      return require('../ElectronWindow/ElectronWindow.ipc.js')
    case ModuleId.ElectronWindowAbout:
      return require('../ElectronWindowAbout/ElectronWindowAbout.ipc.js')
    case ModuleId.ElectronWindowProcessExplorer:
      return require('../ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.ipc.js')
    case ModuleId.ElectronApplicationMenu:
      return require('../ElectronApplicationMenu/ElectronApplicationMenu.ipc.js/index.js.js')
    default:
      throw new Error(\`module \${moduleId} not found\`)
  }
}
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    codeFrame: `  40 |       return require('../ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.ipc.js')
  41 |     case ModuleId.ElectronApplicationMenu:
> 42 |       return require('../ElectronApplicationMenu/ElectronApplicationMenu.ipc.js/index.js.js')
     |              ^
  43 |     default:
  44 |       throw new Error(\`module \${moduleId} not found\`)
  45 |   }`,
    message: `Cannot find module '../ElectronApplicationMenu/ElectronApplicationMenu.ipc.js/index.js.js'`,
    stack: `    at exports.load (/test/packages/main-process/src/parts/Module/Module.js:42:14)
    at getOrLoadModule (/test/packages/main-process/src/parts/Command/Command.js:26:33)
    at loadCommand (/test/packages/main-process/src/parts/Command/Command.js:32:34)
    at exports.invoke (/test/packages/main-process/src/parts/Command/Command.js:64:11)`,
    type: 'Error',
  })
})

test('prepare - dl open failed', async () => {
  const error = new Error(
    `Module did not self-register: 'C:\\test\\packages\\main-process\\node_modules\\windows-process-tree\\build\\Release\\windows_process_tree.node'.`
  )
  error.stack = `Error: Module did not self-register: 'C:\\test\\packages\\main-process\\node_modules\\windows-process-tree\\build\\Release\\windows_process_tree.node'.
    at process.func [as dlopen] (node:electron/js2c/asar_bundle:2:1822)
    at Module._extensions..node (node:internal/modules/cjs/loader:1226:18)
    at Object.func [as .node] (node:electron/js2c/asar_bundle:2:1822)
    at Module.load (node:internal/modules/cjs/loader:1011:32)
    at Module._load (node:internal/modules/cjs/loader:846:12)
    at f._load (node:electron/js2c/asar_bundle:2:13328)
    at Module.require (node:internal/modules/cjs/loader:1035:19)
    at require (node:internal/modules/cjs/helpers:102:18)
    at Object.<anonymous> (C:\\test\\packages\\main-process\\node_modules\\windows-process-tree\\lib\\index.js:8:16)
    at Module._compile (node:internal/modules/cjs/loader:1141:14)'`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `"use strict";
/*---------------------------------------------------------------------------------------------
  *  Copyright (c) Microsoft Corporation. All rights reserved.
  *  Licensed under the MIT License. See License.txt in the project root for license information.
  *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessTree = exports.getProcessCpuUsage = exports.getProcessList = exports.filterProcessList = exports.buildProcessTree = exports.ProcessDataFlag = void 0;
const native = require('../build/Release/windows_process_tree.node');
var ProcessDataFlag;
(function (ProcessDataFlag) {
    ProcessDataFlag[ProcessDataFlag["None"] = 0] = "None";
    ProcessDataFlag[ProcessDataFlag["Memory"] = 1] = "Memory";
    ProcessDataFlag[ProcessDataFlag["CommandLine"] = 2] = "CommandLine";
})(ProcessDataFlag = exports.ProcessDataFlag || (exports.ProcessDataFlag = {}));
// requestInProgress is used for any function that uses CreateToolhelp32Snapshot, as multiple calls
// to this cannot be done at the same time.
let requestInProgress = false;
const processListRequestQueue = [];
const processTreeRequestQueue = [];
const MAX_FILTER_DEPTH = 10;
/**
 * Filters a list of processes to rootPid and its descendents and creates a tree
 * @param rootPid The process to use as the root
 * @param processList The list of processes
 * @param maxDepth The maximum depth to search
 */
function buildProcessTree(rootPid, processList, maxDepth) {
    if (!processList) {
        return undefined;
    }
    const rootIndex = processList.findIndex(v => v.pid === rootPid);
    if (rootIndex === -1) {
        return undefined;
    }
    const rootProcess = processList[rootIndex];
    const childIndexes = processList.filter(v => v.ppid === rootPid);
    const children = [];
    if (maxDepth !== 0) {
        for (const c of childIndexes) {
            const tree = buildProcessTree(c.pid, processList, maxDepth - 1);
            if (tree) {
                children.push(tree);
            }
        }
    }
    return {
        pid: rootProcess.pid,
        name: rootProcess.name,
        memory: rootProcess.memory,
        commandLine: rootProcess.commandLine,
        children
    };
}
exports.buildProcessTree = buildProcessTree;
/**
 * Filters processList to contain the process with rootPid and all of its descendants
 * @param rootPid The root pid
 * @param processList The list of all processes
 * @param maxDepth The maximum depth to search
 */
function filterProcessList(rootPid, processList, maxDepth) {
    const rootIndex = processList.findIndex(v => v.pid === rootPid);
    if (rootIndex === -1) {
        return undefined;
    }
    if (maxDepth === -1) {
        return [];
    }
    const rootProcess = processList[rootIndex];
    const childIndexes = processList.filter(v => v.ppid === rootPid);
    const children = [];
    for (const c of childIndexes) {
        const list = filterProcessList(c.pid, processList, maxDepth - 1);
        if (list) {
            children.push(list);
        }
    }
    return children.reduce((prev, current) => prev.concat(current), [rootProcess]);
}
exports.filterProcessList = filterProcessList;
function getRawProcessList(pid, queue, callback, filter, flags) {
    queue.push({
        callback: callback,
        rootPid: pid
    });
    // Only make a new request if there is not currently a request in progress.
    // This prevents too many requests from being made, there is also a crash that
    // can occur when performing multiple calls to CreateToolhelp32Snapshot at
    // once.
    if (!requestInProgress) {
        requestInProgress = true;
        native.getProcessList((processList) => {
            queue.forEach(r => {
                r.callback(filter(r.rootPid, processList, MAX_FILTER_DEPTH));
            });
            queue.length = 0;
            requestInProgress = false;
        }, flags || 0);
    }
}
/**
 * Returns a list of processes containing the rootPid process and all of its descendants
 * @param rootPid The pid of the process of interest
 * @param callback The callback to use with the returned set of processes
 * @param flags The flags for what process data should be included
 */
function getProcessList(rootPid, callback, flags) {
    getRawProcessList(rootPid, processListRequestQueue, callback, filterProcessList, flags);
}
exports.getProcessList = getProcessList;
/**
 * Returns the list of processes annotated with cpu usage information
 * @param processList The list of processes
 * @param callback The callback to use with the returned list of processes
 */
function getProcessCpuUsage(processList, callback) {
    native.getProcessCpuUsage(processList, (processListWithCpu) => callback(processListWithCpu));
}
exports.getProcessCpuUsage = getProcessCpuUsage;
/**
 * Returns a tree of processes with rootPid as the root
 * @param rootPid The pid of the process that will be the root of the tree
 * @param callback The callback to use with the returned list of processes
 * @param flags Flags indicating what process data should be written on each node
 */
function getProcessTree(rootPid, callback, flags) {
    getRawProcessList(rootPid, processTreeRequestQueue, callback, buildProcessTree, flags);
}
exports.getProcessTree = getProcessTree;
//# sourceMappingURL=index.js.map
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    codeFrame: `   6 | Object.defineProperty(exports, \"__esModule\", { value: true });
   7 | exports.getProcessTree = exports.getProcessCpuUsage = exports.getProcessList = exports.filterProcessList = exports.buildProcessTree = exports.ProcessDataFlag = void 0;
>  8 | const native = require('../build/Release/windows_process_tree.node');
     |                ^
   9 | var ProcessDataFlag;
  10 | (function (ProcessDataFlag) {
  11 |     ProcessDataFlag[ProcessDataFlag[\"None\"] = 0] = \"None\";`,
    message: `Module did not self-register: 'C:\\test\\packages\\main-process\\node_modules\\windows-process-tree\\build\\Release\\windows_process_tree.node'.`,
    stack: `    at Object.<anonymous> (C:\\test\\packages\\main-process\\node_modules\\windows-process-tree\\lib\\index.js:8:16)`,
    type: 'Error',
  })
})

test('prepare - error stack with node:events', async () => {
  const error = new TypeError(`Cannot read properties of undefined (reading 'id')`)
  error.stack = `TypeError: Cannot read properties of undefined (reading 'id')
  at exports.findById (/test/packages/main-process/src/parts/AppWindowStates/AppWindowStates.js:10:28)
  at exports.findById (/test/packages/main-process/src/parts/AppWindow/AppWindow.js:94:26)
  at handlePortForSharedProcess (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:130:28)
  at exports.handlePort (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:234:14)
  at IpcMainImpl.emit (node:events:513:28)
  at EventEmitter.<anonymous> (node:electron/js2c/browser_init:2:81930)
  at EventEmitter.emit (node:events:513:28)`
  // @ts-ignore
  fs.readFileSync.mockImplementation((path) => {
    if (path !== '/test/packages/main-process/src/parts/AppWindowStates/AppWindowStates.js') {
      throw new Error(`file not found ${path}`)
    }
    return `exports.state = {
  /**
   * @type {any[]}
   */
  windows: [],
}

exports.findById = (id) => {
  for (const window of this.state.windows) {
    if (window.webContents.id === id) {
      return window
    }
  }
  return undefined
}

exports.findIndexById = (id) => {
  for (const window of this.state.windows) {
    if (window.webContents.id === id) {
      return window
    }
  }
  return undefined
}

exports.remove = (id) => {
  const index = this.findIndexById(id)
  if (index === -1) {
    throw new Error(\`expected window \${id} to be in windows array\`)
  }
  exports.state.windows.splice(index, 1)
}

exports.add = (config) => {
  exports.state.windows.push(config)
}
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    codeFrame: `   8 | exports.findById = (id) => {
   9 |   for (const window of this.state.windows) {
> 10 |     if (window.webContents.id === id) {
     |                            ^
  11 |       return window
  12 |     }
  13 |   }`,
    message: "Cannot read properties of undefined (reading 'id')",
    stack: `  at exports.findById (/test/packages/main-process/src/parts/AppWindowStates/AppWindowStates.js:10:28)
  at exports.findById (/test/packages/main-process/src/parts/AppWindow/AppWindow.js:94:26)
  at handlePortForSharedProcess (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:130:28)
  at exports.handlePort (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:234:14)`,
    type: 'TypeError',
  })
  expect(fs.readFileSync).toHaveBeenCalledTimes(1)
  expect(fs.readFileSync).toHaveBeenCalledWith(`/test/packages/main-process/src/parts/AppWindowStates/AppWindowStates.js`, 'utf-8')
})

test('prepare - module not found error from inside node_modules', async () => {
  const error = new Error(`Cannot find module 'graceful-fs'
Require stack:
- /test/packages/shared-process/node_modules/fs-extra/lib/copy/copy-sync.js
- /test/packages/shared-process/node_modules/rename-overwrite/index.js
- /test/packages/shared-process/node_modules/symlink-dir/dist/index.js`)
  error.stack = `Error: Cannot find module 'graceful-fs'
Require stack:
- /test/packages/shared-process/node_modules/fs-extra/lib/copy/copy-sync.js
- /test/packages/shared-process/node_modules/rename-overwrite/index.js
- /test/packages/shared-process/node_modules/symlink-dir/dist/index.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1002:15)
    at Module._load (node:internal/modules/cjs/loader:848:27)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at Module.require (node:internal/modules/cjs/loader:1068:19)
    at require (node:internal/modules/cjs/helpers:103:18)
    at Object.<anonymous> (/test/packages/shared-process/node_modules/fs-extra/lib/copy/copy-sync.js:3:12)
    at Module._compile (node:internal/modules/cjs/loader:1174:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `'use strict'

const fs = require('graceful-fs')
const path = require('path')
const mkdirsSync = require('../mkdirs').mkdirsSync
const utimesMillisSync = require('../util/utimes').utimesMillisSync
const stat = require('../util/stat')

function copySync (src, dest, opts) {
  if (typeof opts === 'function') {
    opts = { filter: opts }
  }

  opts = opts || {}
  opts.clobber = 'clobber' in opts ? !!opts.clobber : true // default to true for now
  opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber // overwrite falls back to clobber

  // Warn about using preserveTimestamps on 32-bit node
  if (opts.preserveTimestamps && process.arch === 'ia32') {
    process.emitWarning(
      'Using the preserveTimestamps option in 32-bit node is not recommended;\n
      '\tsee https://github.com/jprichardson/node-fs-extra/issues/269',
      'Warning', 'fs-extra-WARN0002'
    )
  }

  const { srcStat, destStat } = stat.checkPathsSync(src, dest, 'copy', opts)
  stat.checkParentPathsSync(src, srcStat, dest, 'copy')
  return handleFilterAndCopy(destStat, src, dest, opts)
}

function handleFilterAndCopy (destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest)) return
  const destParent = path.dirname(dest)
  if (!fs.existsSync(destParent)) mkdirsSync(destParent)
  return getStats(destStat, src, dest, opts)
}

function startCopy (destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest)) return
  return getStats(destStat, src, dest, opts)
}

function getStats (destStat, src, dest, opts) {
  const statSync = opts.dereference ? fs.statSync : fs.lstatSync
  const srcStat = statSync(src)

  if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts)
  else if (srcStat.isFile() ||
            srcStat.isCharacterDevice() ||
            srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts)
  else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts)
  else if (srcStat.isSocket()) throw new Error(\`Cannot copy a socket file: \${src}\`)
  else if (srcStat.isFIFO()) throw new Error(\`Cannot copy a FIFO pipe: \${src}\`)
  throw new Error(\`Unknown file: \${src}\`)
}

function onFile (srcStat, destStat, src, dest, opts) {
  if (!destStat) return copyFile(srcStat, src, dest, opts)
  return mayCopyFile(srcStat, src, dest, opts)
}

function mayCopyFile (srcStat, src, dest, opts) {
  if (opts.overwrite) {
    fs.unlinkSync(dest)
    return copyFile(srcStat, src, dest, opts)
  } else if (opts.errorOnExist) {
    throw new Error(\`'\${dest}' already exists\`)
  }
}

function copyFile (srcStat, src, dest, opts) {
  fs.copyFileSync(src, dest)
  if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest)
  return setDestMode(dest, srcStat.mode)
}

function handleTimestamps (srcMode, src, dest) {
  // Make sure the file is writable before setting the timestamp
  // otherwise open fails with EPERM when invoked with 'r+'
  // (through utimes call)
  if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode)
  return setDestTimestamps(src, dest)
}

function fileIsNotWritable (srcMode) {
  return (srcMode & 0o200) === 0
}

function makeFileWritable (dest, srcMode) {
  return setDestMode(dest, srcMode | 0o200)
}

function setDestMode (dest, srcMode) {
  return fs.chmodSync(dest, srcMode)
}

function setDestTimestamps (src, dest) {
  // The initial srcStat.atime cannot be trusted
  // because it is modified by the read(2) system call
  // (See https://nodejs.org/api/fs.html#fs_stat_time_values)
  const updatedSrcStat = fs.statSync(src)
  return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime)
}

function onDir (srcStat, destStat, src, dest, opts) {
  if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts)
  return copyDir(src, dest, opts)
}

function mkDirAndCopy (srcMode, src, dest, opts) {
  fs.mkdirSync(dest)
  copyDir(src, dest, opts)
  return setDestMode(dest, srcMode)
}

function copyDir (src, dest, opts) {
  fs.readdirSync(src).forEach(item => copyDirItem(item, src, dest, opts))
}

function copyDirItem (item, src, dest, opts) {
  const srcItem = path.join(src, item)
  const destItem = path.join(dest, item)
  const { destStat } = stat.checkPathsSync(srcItem, destItem, 'copy', opts)
  return startCopy(destStat, srcItem, destItem, opts)
}

function onLink (destStat, src, dest, opts) {
  let resolvedSrc = fs.readlinkSync(src)
  if (opts.dereference) {
    resolvedSrc = path.resolve(process.cwd(), resolvedSrc)
  }

  if (!destStat) {
    return fs.symlinkSync(resolvedSrc, dest)
  } else {
    let resolvedDest
    try {
      resolvedDest = fs.readlinkSync(dest)
    } catch (err) {
      // dest exists and is a regular file or directory,
      // Windows may throw UNKNOWN error. If dest already exists,
      // fs throws error anyway, so no need to guard against it here.
      if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return fs.symlinkSync(resolvedSrc, dest)
      throw err
    }
    if (opts.dereference) {
      resolvedDest = path.resolve(process.cwd(), resolvedDest)
    }
    if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
      throw new Error(\`Cannot copy '\${resolvedSrc}' to a subdirectory of itself, '\${resolvedDest}'.\`)
    }

    // prevent copy if src is a subdir of dest since unlinking
    // dest in this case would result in removing src contents
    // and therefore a broken symlink would be created.
    if (fs.statSync(dest).isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
      throw new Error(\`Cannot overwrite '\${resolvedDest}' with '\${resolvedSrc}'.\`)
    }
    return copyLink(resolvedSrc, dest)
  }
}

function copyLink (resolvedSrc, dest) {
  fs.unlinkSync(dest)
  return fs.symlinkSync(resolvedSrc, dest)
}

module.exports = copySync

`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    codeFrame: `  1 | 'use strict'
  2 |
> 3 | const fs = require('graceful-fs')
    |            ^
  4 | const path = require('path')
  5 | const mkdirsSync = require('../mkdirs').mkdirsSync
  6 | const utimesMillisSync = require('../util/utimes').utimesMillisSync`,
    message: "Cannot find module 'graceful-fs'",
    // TODO should print more of the stack trace
    stack: '    at Object.<anonymous> (/test/packages/shared-process/node_modules/fs-extra/lib/copy/copy-sync.js:3:12)',
    type: 'Error',
  })
})

test('prepare - syntax error - unexpected token export', async () => {
  const error = new SyntaxError(`Unexpected token 'export'`)
  error.stack = `/test/packages/main-process/src/parts/GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js:3
export const getFirstNodeWorkerEvent = async (worker) => {
^^^^^^

SyntaxError: Unexpected token 'export'
    at Object.compileFunction (node:vm:360:18)
    at wrapSafe (node:internal/modules/cjs/loader:1095:15)
    at Module._compile (node:internal/modules/cjs/loader:1130:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1229:10)
    at Module.load (node:internal/modules/cjs/loader:1044:32)
    at Module._load (node:internal/modules/cjs/loader:885:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at Module.require (node:internal/modules/cjs/loader:1068:19)
    at require (node:internal/modules/cjs/helpers:103:18)
    at Object.<anonymous> (/test/packages/main-process/src/parts/CliForwardToSharedProcess/CliForwardToSharedProcess.js:4:33)`

  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')

export const getFirstNodeWorkerEvent = async (worker) => {
  const { type, event } = await new Promise((resolve, reject) => {
    const cleanup = () => {
      worker.off('exit', handleExit)
      worker.off('error', handleError)
    }
    const handleExit = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Exit, event })
    }
    const handleError = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Error, event })
    }
    worker.on('exit', handleExit)
    worker.on('error', handleError)
  })
  return { type, event }
}

exports.getFirstNodeWorkerEvent = getFirstNodeWorkerEvent
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    codeFrame: `  1 | const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')
  2 |
> 3 | export const getFirstNodeWorkerEvent = async (worker) => {
    | ^
  4 |   const { type, event } = await new Promise((resolve, reject) => {
  5 |     const cleanup = () => {
  6 |       worker.off('exit', handleExit)`,
    message: "Unexpected token 'export'",
    stack: `    at /test/packages/main-process/src/parts/GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js:3
    at Object.<anonymous> (/test/packages/main-process/src/parts/CliForwardToSharedProcess/CliForwardToSharedProcess.js:4:33)`,
    type: 'SyntaxError',
  })
})

test('prepare - type error - object that needs transfer was found in message but not listed in transferList', async () => {
  const error = new TypeError(`Object that needs transfer was found in message but not listed in transferList`)
  error.stack = `TypeError: Object that needs transfer was found in message but not listed in transferList
    at Worker.postMessage (node:internal/worker:343:5)
    at Object.send (/test/packages/main-process/src/parts/IpcParentWithNodeWorker/IpcParentWithNodeWorker.js:24:19)
    at handlePortForSharedProcess (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:153:17)`

  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `const Assert = require('../Assert/Assert.js')
const { Worker } = require('node:worker_threads')
const GetFirstNodeWorkerEvent = require('../GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js')

exports.create = async ({ path, argv, env, execArgv }) => {
  Assert.string(path)
  const worker = new Worker(path, {
    argv,
    env,
    execArgv,
  })
  const { type, event } = await GetFirstNodeWorkerEvent.getFirstNodeWorkerEvent(worker)
  console.log({ type })
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
  expect(prettyError).toEqual({
    codeFrame: `  22 |     },
  23 |     send(message) {
> 24 |       this.worker.postMessage(message)
     |                   ^
  25 |     },
  26 |     sendAndTransfer(message, transfer) {
  27 |       this.worker.postMessage(message, transfer)`,
    message: 'Object that needs transfer was found in message but not listed in transferList',
    stack: `    at Object.send (/test/packages/main-process/src/parts/IpcParentWithNodeWorker/IpcParentWithNodeWorker.js:24:19)
    at handlePortForSharedProcess (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:153:17)`,
    type: 'TypeError',
  })
})

test('prepare - error - failed to load window', async () => {
  const error = new Error(`Failed to load window url "lvce-oss://-": ERR_INVALID_URL (-300) loading 'lvce-oss://-/`)
  error.stack = `VError: Failed to load window url "lvce-oss://-": ERR_INVALID_URL (-300) loading 'lvce-oss://-/'
    at loadUrl (/test/packages/main-process/src/parts/AppWindow/AppWindow.js:31:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async exports.createAppWindow (/test/packages/main-process/src/parts/AppWindow/AppWindow.js:85:3)
    at async exports.handleReady (/test/packages/main-process/src/parts/ElectronAppListeners/ElectronAppListeners.js:30:3)
    at async exports.hydrate (/test/packages/main-process/src/parts/App/App.js:102:3)
    at async main (/test/packages/main-process/src/mainProcessMain.js:15:3)`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `const VError = require('verror')
const Screen = require('../ElectronScreen/ElectronScreen.js')
const Window = require('../ElectronWindow/ElectronWindow.js')
const Performance = require('../Performance/Performance.js')
const LifeCycle = require('../LifeCycle/LifeCycle.js')
const Session = require('../ElectronSession/ElectronSession.js')
const Platform = require('../Platform/Platform.js')
const Preferences = require('../Preferences/Preferences.js')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const Logger = require('../Logger/Logger.js')
const ElectronApplicationMenu = require('../ElectronApplicationMenu/ElectronApplicationMenu.js')

// TODO impossible to test these methods
// and ensure that there is no memory leak
/**
 * @param {import('electron').Event} event
 */
const handleWindowClose = (event) => {
  const browserWindow = event.sender
  AppWindowStates.remove(browserWindow.webContents.id)
}

const loadUrl = async (browserWindow, url) => {
  Performance.mark('code/willLoadUrl')
  try {
    await browserWindow.loadURL(url)
  } catch (error) {
    if (LifeCycle.isShutDown()) {
      Logger.info('error during shutdown', error)
    } else {
      throw new VError(
        // @ts-ignore
        error,
        \`Failed to load window url "\${url}"\`
      )
    }
  }
  Performance.mark('code/didLoadUrl')
}

const defaultUrl = \`\${Platform.scheme}://-\`

// TODO avoid mixing BrowserWindow, childprocess and various lifecycle methods in one file -> separate concerns
exports.createAppWindow = async (parsedArgs, workingDirectory, url = defaultUrl) => {
  const preferences = await Preferences.load()
  const titleBarPreference = Preferences.get(preferences, 'window.titleBarStyle')
  const frame = titleBarPreference !== 'custom'
  const titleBarStyle = titleBarPreference === 'custom' ? 'hidden' : undefined
  const zoomLevelPreference = Preferences.get(preferences, 'window.zoomLevel')
  const zoomLevel = zoomLevelPreference
  const windowControlsOverlayPreference = Platform.isWindows && Preferences.get(preferences, 'window.controlsOverlay.enabled')
  const titleBarOverlay = windowControlsOverlayPreference
    ? {
        color: '#1e2324',
        symbolColor: '#74b1be',
        height: 29,
      }
    : undefined
  const session = Session.get()
  const window = Window.create({
    y: 0,
    x: Screen.getWidth() - 800,
    width: 800,
    height: Screen.getHeight(),
    menu: true,
    background: '#1e2324',
    session,
    titleBarStyle,
    frame,
    zoomLevel,
    titleBarOverlay,
  })
  const menu = ElectronApplicationMenu.createTitleBar()
  ElectronApplicationMenu.setMenu(menu)

  // window.setMenu(menu)
  window.setMenuBarVisibility(true)
  window.setAutoHideMenuBar(false)
  window.on('close', handleWindowClose)
  AppWindowStates.add({
    parsedArgs,
    workingDirectory,
    id: window.webContents.id,
  })
  await loadUrl(window, url)
}

exports.openNew = (url) => {
  return exports.createAppWindow([], '', url)
}

exports.findById = (id) => {
  return AppWindowStates.findById(id)
}
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    codeFrame: `  29 |       Logger.info('error during shutdown', error)
  30 |     } else {
> 31 |       throw new VError(
     |             ^
  32 |         // @ts-ignore
  33 |         error,
  34 |         \`Failed to load window url \"\${url}\"\``,
    message: 'Failed to load window url "lvce-oss://-": ERR_INVALID_URL (-300) loading \'lvce-oss://-/',
    stack: `    at loadUrl (/test/packages/main-process/src/parts/AppWindow/AppWindow.js:31:13)
    at async exports.createAppWindow (/test/packages/main-process/src/parts/AppWindow/AppWindow.js:85:3)
    at async exports.handleReady (/test/packages/main-process/src/parts/ElectronAppListeners/ElectronAppListeners.js:30:3)
    at async exports.hydrate (/test/packages/main-process/src/parts/App/App.js:102:3)
    at async main (/test/packages/main-process/src/mainProcessMain.js:15:3)`,
    type: 'Error',
  })
})

test('prepare - error - file url must be absolute', async () => {
  const error = new TypeError(`File URL path must be absolute`)
  error.stack = `TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must be absolute
    at new NodeError (node:internal/errors:393:5)
    at getPathFromURLWin32 (node:internal/url:1458:11)
    at fileURLToPath (node:internal/url:1490:22)
    at getAbsolutePath (C:\\test\\packages\\main-process\\src\\parts\\ElectronSession\\ElectronSession.js:138:14)
    at Function.handleRequest (C:\\test\\packages\\main-process\\src\\parts\\ElectronSession\\ElectronSession.js:152:16`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `const ContentSecurityPolicy = require('../ContentSecurityPolicy/ContentSecurityPolicy.js')
const ContentSecurityPolicyWorker = require('../ContentSecurityPolicyWorker/ContentSecurityPolicyWorker.js')
const CrossOriginEmbedderPolicy = require('../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js')
const CrossOriginOpenerPolicy = require('../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.js')
const Electron = require('electron')
const ElectronPermissionType = require('../ElectronPermissionType/ElectronPermissionType.js')
const ElectronResourceType = require('../ElectronResourceType/ElectronResourceType.js')
const Path = require('../Path/Path.js')
const Platform = require('../Platform/Platform.js')
const Root = require('../Root/Root.js')
const { existsSync } = require('node:fs')
const { join } = require('node:path')
const HttpStatusCode = require('../HttpStatusCode/HttpStatusCode.js')
const { fileURLToPath } = require('node:url')

const state = {
  /**
   * @type {import('electron').Session|undefined}
   */
  session: undefined,
}

const handleHeadersReceivedMainFrame = (responseHeaders) => {
  return {
    responseHeaders: {
      ...responseHeaders,
      [ContentSecurityPolicy.key]: ContentSecurityPolicy.value,
      [CrossOriginOpenerPolicy.key]: CrossOriginOpenerPolicy.value,
      [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
    },
  }
}

const handleHeadersReceivedSubFrame = (responseHeaders) => {
  return {
    responseHeaders: {
      ...responseHeaders,
      [CrossOriginOpenerPolicy.key]: CrossOriginOpenerPolicy.value,
      [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
    },
  }
}

const handleHeadersReceivedDefault = (responseHeaders, url) => {
  if (url.endsWith('WorkerMain.js')) {
    return {
      responseHeaders: {
        ...responseHeaders,
        [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
        [ContentSecurityPolicyWorker.key]: ContentSecurityPolicyWorker.value,
      },
    }
  }
  return {
    responseHeaders,
  }
}

const handleHeadersReceivedXhr = (responseHeaders, url) => {
  // workaround for electron bug
  // when using fetch, it doesn't return a response for 404
  // console.log({ url, responseHeaders })
  return {
    responseHeaders: {
      ...responseHeaders,
    },
  }
}

const getHeadersReceivedFunction = (resourceType) => {
  // console.log({ resourceType })
  switch (resourceType) {
    case ElectronResourceType.MainFrame:
      return handleHeadersReceivedMainFrame
    case ElectronResourceType.SubFrame:
      return handleHeadersReceivedSubFrame
    case ElectronResourceType.Xhr:
      return handleHeadersReceivedXhr
    default:
      return handleHeadersReceivedDefault
  }
}

/**
 *
 * @param {import('electron').OnHeadersReceivedListenerDetails} details
 * @param {(headersReceivedResponse: import('electron').HeadersReceivedResponse)=>void} callback
 */
const handleHeadersReceived = (details, callback) => {
  const { responseHeaders, resourceType, url } = details
  const fn = getHeadersReceivedFunction(resourceType)
  callback(fn(responseHeaders, url))
}

const isAllowedPermission = (permission) => {
  switch (permission) {
    case ElectronPermissionType.ClipBoardRead:
    case ElectronPermissionType.ClipBoardSanitizedWrite:
    case ElectronPermissionType.FullScreen:
    case ElectronPermissionType.WindowPlacement:
      return true
    default:
      return false
  }
}

const handlePermissionRequest = (webContents, permission, callback, details) => {
  callback(isAllowedPermission(permission))
}

const handlePermissionCheck = (webContents, permission, origin, details) => {
  return isAllowedPermission(permission)
}

// TODO use Platform.getScheme() instead of Product.getTheme()

const getAbsolutePath = (requestUrl) => {
  const decoded = decodeURI(requestUrl)
  const { scheme } = Platform
  const pathName = decoded.slice(\`\${scheme}://-\`.length)
  // TODO remove if/else in prod (use replacement)
  if (pathName === \`/\` || pathName.startsWith(\`/?\`)) {
    return Path.join(Root.root, 'static', 'index.html')
  }
  if (pathName.startsWith(\`/packages\`)) {
    return Path.join(Root.root, pathName)
  }
  if (pathName.startsWith(\`/static\`)) {
    return Path.join(Root.root, pathName)
  }
  if (pathName.startsWith(\`/extensions\`)) {
    return Path.join(Root.root, pathName)
  }
  // TODO maybe have a separate protocol for remote, e.g. vscode has vscode-remote
  if (pathName.startsWith(\`/remote\`)) {
    const uri = pathName.slice('/remote'.length)
    if (Platform.isWindows) {
      return fileURLToPath(\`file://\` + uri)
    }
    return uri
  }
  return Path.join(Root.root, 'static', pathName)
}
/**
 *
 * @param {globalThis.Electron.ProtocolRequest} request
 * @param {(response: string | globalThis.Electron.ProtocolResponse) => void} callback
 */

const handleRequest = (request, callback) => {
  // const path = join(__dirname, request.url.slice(6))
  const path = getAbsolutePath(request.url)
  if (!existsSync(path)) {
    // TODO doing this for every request is really slow
    // but without this, fetch would not received a response for 404 requests
    return callback({
      statusCode: HttpStatusCode.NotFound,
      path: join(__dirname, 'not-found.txt'),
    })
  }
  callback({
    path,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable', // TODO caching is not working, see https://github.com/electron/electron/issues/27075 and https://github.com/electron/electron/issues/23482
    },
  })
}

const createSession = () => {
  const sessionId = Platform.getSessionId()
  const session = Electron.session.fromPartition(sessionId, {
    cache: Platform.isProduction,
  })
  session.webRequest.onHeadersReceived(handleHeadersReceived)
  session.setPermissionRequestHandler(handlePermissionRequest)
  session.setPermissionCheckHandler(handlePermissionCheck)
  session.protocol.registerFileProtocol(Platform.scheme, handleRequest)
  return session
}

exports.state = state

exports.get = () => {
  if (!state.session) {
    state.session = createSession()
  }
  return state.session
}
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    codeFrame: `  136 |     const uri = pathName.slice('/remote'.length)
  137 |     if (Platform.isWindows) {
> 138 |       return fileURLToPath(\`file://\` + uri)
      |              ^
  139 |     }
  140 |     return uri
  141 |   }`,
    message: 'File URL path must be absolute',
    stack: `    at getAbsolutePath (C:\\test\\packages\\main-process\\src\\parts\\ElectronSession\\ElectronSession.js:138:14)
    at Function.handleRequest (C:\\test\\packages\\main-process\\src\\parts\\ElectronSession\\ElectronSession.js:152:16`,
    type: 'TypeError',
  })
})
