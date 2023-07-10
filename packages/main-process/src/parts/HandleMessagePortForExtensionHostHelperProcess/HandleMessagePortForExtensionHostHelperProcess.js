const IpcParent = require('../IpcParent/IpcParent.js')
const IpcParentType = require('../IpcParentType/IpcParentType.js')
const Logger = require('../Logger/Logger.cjs')
const Platform = require('../Platform/Platform.cjs')

/**
 *
 * @param {any} event
 * @param {import('electron').MessagePortMain} browserWindowPort
 */
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
  const cleanup = () => {
    browserWindowPort.off('message', handlePortMessage)
    browserWindowPort.off('close', handlePortClosed)
    if (ipc.off) {
      ipc.off('message', handleIpcMessage)
    }
    webContents.off('destroyed', handleWebContentsDestroyed)
    browserWindowPort.close()
    ipc.dispose()
  }
  const handleIpcMessage = (event) => {
    browserWindowPort.postMessage(event)
  }
  const handlePortMessage = (event) => {
    ipc.send(event.data)
  }
  const handleWebContentsDestroyed = () => {
    cleanup()
  }
  const handlePortClosed = () => {
    cleanup()
  }
  const webContents = event.sender
  browserWindowPort.on('message', handlePortMessage)
  browserWindowPort.on('close', handlePortClosed)
  ipc.on('message', handleIpcMessage)
  webContents.on('destroyed', handleWebContentsDestroyed)
  if (webContents.isDestroyed()) {
    cleanup()
    return
  }
  browserWindowPort.start()
}
