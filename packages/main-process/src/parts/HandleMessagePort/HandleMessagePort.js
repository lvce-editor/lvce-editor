const { spawn, fork } = require('child_process')
const { MessageChannel } = require('worker_threads')
const Electron = require('electron')
const Platform = require('../Platform/Platform.js')
const SharedProcess = require('../SharedProcess/SharedProcess.js')
const Debug = require('../Debug/Debug.js')
const LifeCycle = require('../LifeCycle/LifeCycle.js')
const Performance = require('../Performance/Performance.js')
const AppWindow = require('../AppWindow/AppWindow.js')
const Command = require('../Command/Command.js')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const PendingPorts = require('../PendingPorts/PendingPorts.js')
const JsonRpcErrorCode = require('../JsonRpcErrorCode/JsonRpcErrorCode.js')

// TODO use Platform.getScheme() instead of Product.getTheme()

// const handleAppReady = async () => {

// }

const handleWindowAllClosed = () => {
  Debug.debug('[info] all windows closed')
  if (!Platform.isMacOs) {
    Debug.debug('[info] quitting')
    Electron.app.quit()
  }
}

const handleBeforeQuit = () => {
  LifeCycle.setShutDown()
  Debug.debug('[info] before quit')
}

// TODO maybe handle critical (first render) request via ipcMain
// and spawn shared process when page is idle/loaded
// currently launching shared process takes 170ms
// which means first paint is delayed by a lot

// map windows to folders and ports
// const windowConfigMap = new Map()

const handlePortForExtensionHost = async (event) => {
  const extensionHostPath = Platform.getExtensionHostPath()
  const start = Date.now()
  const extensionHost = fork(extensionHostPath, ['--ipc-type=parent'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
    },
  })
  const end = Date.now()
  const pid = extensionHost.pid
  const forkTime = end - start
  console.info(
    `[main-process] Starting extension host with pid ${pid} (fork took ${forkTime} ms).`
  )
  const browserWindowPort = event.ports[0]

  await new Promise((resolve, reject) => {
    const handleFirstMessage = (event) => {
      if (event === 'ready') {
        resolve(undefined)
      } else {
        reject(new Error('unexpected first message'))
      }
    }
    extensionHost.once('message', handleFirstMessage)
  })
  browserWindowPort.on('message', (event) => {
    console.log({ event })
    extensionHost.send(event.data)
  })
  extensionHost.on('message', (event) => {
    console.log({ event })
    browserWindowPort.postMessage(event)
  })
  browserWindowPort.start()
}

const handlePortForExtensionHostHelperProcess = async (event) => {
  const extensionHostPath = Platform.getExtensionHostHelperProcessPath()
  const start = Date.now()
  const extensionHost = fork(extensionHostPath, ['--ipc-type=parent'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
    },
  })
  const end = Date.now()
  const pid = extensionHost.pid
  const forkTime = end - start
  console.info(
    `[main-process] Starting extension host helper with pid ${pid} (fork took ${forkTime} ms).`
  )
  const browserWindowPort = event.ports[0]

  await new Promise((resolve, reject) => {
    const handleFirstMessage = (event) => {
      if (event === 'ready') {
        resolve(undefined)
      } else {
        reject(new Error('unexpected first message'))
      }
    }
    extensionHost.once('message', handleFirstMessage)
  })
  console.log('host is ready')
  browserWindowPort.on('message', (event) => {
    console.log({ event })
    extensionHost.send(event.data)
  })
  extensionHost.on('message', (event) => {
    console.log({ event })
    browserWindowPort.postMessage(event)
  })
  browserWindowPort.start()
}

const getFolder = (args) => {
  if (!args || !args._ || args._.length === 0) {
    return ''
  }
  return args._[0]
}

const handlePortForSharedProcess = async (event) => {
  const config = AppWindow.findById(event.sender.id)
  if (!config) {
    console.warn('port event - config expected')
    return
  }
  const browserWindowPort = event.ports[0]
  const folder = getFolder(config.parsedArgs)
  Performance.mark('code/willStartSharedProcess')
  const sharedProcess = await SharedProcess.hydrate({
    FOLDER: folder,
  })
  const messageChannel = new MessageChannel()
  const port1 = messageChannel.port1
  const port2 = messageChannel.port2
  Performance.mark('code/didStartSharedProcess')
  browserWindowPort.on('message', (event) => {
    // console.log('got message from browser window', event.data)
    port2.postMessage(event.data)
  })
  port2.on('message', (message) => {
    // console.log('send message to browser window', message)
    browserWindowPort.postMessage(message)
  })
  sharedProcess.postMessage(
    {
      initialize: {
        port: port1,
        folder,
      },
    },
    [port1]
  )
  // SharedProcess.sendPort(port1)
  // SharedProcess.send({ command: 'setFolder', folder })

  // windowConfigMap.set(event.sender, port1)

  // SharedProcess.setOnMessage((message) => {
  //   browserWindowPort.postMessage(message)
  // })
  browserWindowPort.start()
}

const handlePortForMainProcess = (event) => {
  const browserWindowPort = event.ports[0]
  const id = event.sender.id
  // console.log({ id })
  const state = AppWindowStates.findById(id)
  state.port = browserWindowPort
  const handleMessage = async (event) => {
    const message = event.data
    try {
      const result = await Command.execute(message.method, ...message.params)
      browserWindowPort.postMessage({
        jsonrpc: '2.0',
        id: message.id,
        result,
      })
    } catch (error) {
      if (
        error &&
        error instanceof Error &&
        error.message &&
        error.message.startsWith('method not found')
      ) {
        browserWindowPort.postMessage({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            code: JsonRpcErrorCode.MethodNotFound,
            message: error.message,
            data: error.stack,
          },
        })
      } else {
        browserWindowPort.postMessage({
          jsonrpc: '2.0',
          id: message.id,
          error,
        })
      }
    }
  }
  browserWindowPort.on('message', handleMessage)
  browserWindowPort.start()
}

exports.handlePortForMainProcess = handlePortForMainProcess

/**
 *
 * @param {*} views
 * @returns {Electron.BrowserView|undefined}
 */
const getQuickPickViewFromArray = (views) => {
  for (const view of views) {
    const url = view.webContents.getURL()
    console.log({ url })
    if (url.endsWith('quickpick.html')) {
      return view
    }
  }
  return undefined
}

const handlePortForQuickPick = (event) => {
  const browserWindowPort = event.ports[0]
  const browserWindow = Electron.BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const views = browserWindow.getBrowserViews()
  const quickPickview = getQuickPickViewFromArray(views)
  if (!quickPickview) {
    PendingPorts.add('quickPick', browserWindowPort)
    // TODO handle different quickpick view states
    // disposed -> do nothing
    // creating -> wait for creation, then post message
    console.log('no quickpick view', views)
    return
  }
  console.log('send port to quickpick')
  quickPickview.webContents.postMessage('port', '', [browserWindowPort])
}

/**
 * @param {import('electron').IpcMainEvent} event
 */
exports.handlePort = async (event, data) => {
  switch (data) {
    case 'shared-process':
      return handlePortForSharedProcess(event)
    case 'extension-host':
      return handlePortForExtensionHost(event)
    case 'electron-process':
      return handlePortForMainProcess(event)
    // case 'quickpick-browserview':
    //   return handlePortFromQuickPick(event)
    case 'quickpick':
      return handlePortForQuickPick(event)
    case 'extension-host-helper-process':
      return handlePortForExtensionHostHelperProcess(event)
    default:
      console.error(`[main-process] unexpected port type ${data}`)
  }
}
