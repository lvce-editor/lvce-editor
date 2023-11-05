import { MessageChannelMain } from 'electron'
import * as Assert from '../Assert/Assert.js'
import * as ElectronPreloadChannelType from '../ElectronPreloadChannelType/ElectronPreloadChannelType.js'
import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.js'
import * as GetSuccessResponse from '../GetSuccessResponse/GetSuccessResponse.js'

const getModule = (type) => {
  switch (type) {
    case 'shared-process':
      return import('../HandleMessagePortForSharedProcess/HandleMessagePortForSharedProcess.js')
    case 'extension-host':
      return import('../HandleMessagePortForExtensionHost/HandleMessagePortForExtensionHost.js')
    case 'electron-process':
      return import('../HandleMessagePortForMainProcess/HandleMessagePortForMainProcess.js')
    case 'quickpick':
      return import('../HandleMessagePortForQuickPick/HandleMessagePortForQuickPick.js')
    case 'extension-host-helper-process':
      return import('../HandleMessagePortForExtensionHostHelperProcess/HandleMessagePortForExtensionHostHelperProcess.js')
    case 'terminal-process':
      return import('../HandleMessagePortForTerminalProcess/HandleMessagePortForTerminalProcess.js')
    default:
      if (type.startsWith('custom:')) {
        return import('../HandleMessagePortForCustom/HandleMessagePortForCustom.js')
      }
      return undefined
  }
}

const createWebContentsIpc = (webContents) => {
  return {
    webContents,
    send(message) {
      this.webContents.postMessage(ElectronPreloadChannelType.Port, message)
    },
    sendAndTransfer(message, transfer) {
      this.webContents.postMessage(ElectronPreloadChannelType.Port, message, transfer)
    },
    isDisposed() {
      return this.webContents.isDestroyed()
    },
  }
}

/**
 * @param {import('electron').IpcMainEvent} event
 */
export const handlePort = async (event, message) => {
  Assert.object(event)
  Assert.object(message)
  const { sender } = event
  const data = message.params[0]
  const ipc = createWebContentsIpc(sender)
  try {
    const module = await getModule(data)
    if (!module) {
      throw new Error(`Unexpected port type ${data}`)
    }
    const channel = new MessageChannelMain()
    const { port1, port2 } = channel
    await module.handlePort(event, port1, ...message.params)
    const response = GetSuccessResponse.getSuccessResponse(message, null)
    ipc.sendAndTransfer(response, [port2])
  } catch (error) {
    const response = await GetErrorResponse.getErrorResponse(message, error)
    const isDestroyed = ipc.isDisposed()
    if (isDestroyed) {
      return
    }
    ipc.send(response)
  }
}
