const { MessageChannel } = require('node:worker_threads')
const SharedProcess = require('../SharedProcess/SharedProcess.js')
const Performance = require('../Performance/Performance.js')
const AppWindow = require('../AppWindow/AppWindow.js')
const Logger = require('../Logger/Logger.js')
const PerformanceMarkerType = require('../PerformanceMarkerType/PerformanceMarkerType.js')

// TODO maybe handle critical (first render) request via ipcMain
// and spawn shared process when page is idle/loaded
// currently launching shared process takes 170ms
// which means first paint is delayed by a lot

// map windows to folders and ports
// const windowConfigMap = new Map()

const getFolder = (args) => {
  if (!args || !args._ || args._.length === 0) {
    return ''
  }
  return args._[0]
}

/**
 *
 * @param {import('electron').IpcMainEvent} event
 * @returns
 */
exports.handlePort = async (event) => {
  const config = AppWindow.findById(event.sender.id)
  if (!config) {
    Logger.warn('port event - config expected')
    return
  }
  const browserWindowPort = event.ports[0]
  const folder = getFolder(config.parsedArgs)
  Performance.mark(PerformanceMarkerType.WillStartSharedProcess)
  const sharedProcess = await SharedProcess.hydrate({
    FOLDER: folder,
  })
  const messageChannel = new MessageChannel()
  const { port1 } = messageChannel
  const { port2 } = messageChannel
  Performance.mark(PerformanceMarkerType.DidStartSharedProcess)
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
