const IpcParent = require('../IpcParent/IpcParent.js')
const IpcParentType = require('../IpcParentType/IpcParentType.js')
const Logger = require('../Logger/Logger.js')
const Platform = require('../Platform/Platform.js')

exports.handlePort = async (event, browserWindowPort) => {
  const extensionHostHelperProcessPath = Platform.getExtensionHostHelperProcessPath()
  const start = performance.now()
  const ipc = await IpcParent.create({
    method: IpcParentType.NodeForkedProcess,
    path: extensionHostHelperProcessPath,
  })
  const end = performance.now()
  const { pid } = ipc
  const forkTime = end - start
  Logger.info(`[main-process] Starting extension host helper with pid ${pid} (fork took ${forkTime} ms).`)
  browserWindowPort.on('message', (event) => {
    ipc.send(event.data)
  })
  ipc.on('message', (event) => {
    browserWindowPort.postMessage(event)
  })
  browserWindowPort.start()
}
