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
  })
})
