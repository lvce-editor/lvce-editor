const AppWindow = require('../AppWindow/AppWindow.js')
const ConnectIpc = require('../ConnectIpc/ConnectIpc.js')
const IpcParentType = require('../IpcParentType/IpcParentType.js')
const Logger = require('../Logger/Logger.js')
const Performance = require('../Performance/Performance.js')
const PerformanceMarkerType = require('../PerformanceMarkerType/PerformanceMarkerType.js')
const SharedProcess = require('../SharedProcess/SharedProcess.js')

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

// TODO when shared process is a utility process
// can just send browserWindowPort to shared process
// else need proxy events through this process

/**
 *
 * @param {import('electron').IpcMainEvent} event
 * @returns
 */
exports.handlePort = async (event, browserWindowPort) => {
  const config = AppWindow.findById(event.sender.id)
  if (!config) {
    Logger.warn('port event - config expected')
    return
  }
  const folder = getFolder(config.parsedArgs)
  Performance.mark(PerformanceMarkerType.WillStartSharedProcess)
  const method = IpcParentType.NodeWorker
  const sharedProcess = await SharedProcess.hydrate({
    method,
    env: {
      FOLDER: folder,
    },
  })
  await ConnectIpc.connectIpc(method, sharedProcess, browserWindowPort, folder)
}
