import { MessageChannelMain } from 'electron'
import * as Assert from '../Assert/Assert.js'
import * as ElectronPreloadChannelType from '../ElectronPreloadChannelType/ElectronPreloadChannelType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import { getSuccessResponse } from '../JsonRpc/JsonRpc.js'
import * as PrettyError from '../PrettyError/PrettyError.js'

const logError = (error, prettyError) => {
  // ignore
}

const getModule = (type) => {
  switch (type) {
    case 'shared-process':
      return import('../HandleMessagePortForSharedProcess/HandleMessagePortForSharedProcess.js')
    case 'extension-host':
      return import('../HandleMessagePortForExtensionHost/HandleMessagePortForExtensionHost.js')
    case 'extension-host-helper-process':
      return import('../HandleMessagePortForExtensionHostHelperProcess/HandleMessagePortForExtensionHostHelperProcess.js')
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

  const { sender, ports } = event
  const data = message.params[0]
  const ipc = createWebContentsIpc(sender)
  try {
    const module = await getModule(data)
    if (!module) {
      throw new Error(`Unexpected port type ${data}`)
    }
    const port = ports[0]
    await module.handlePort(event, port, ...message.params)
    const response = getSuccessResponse(message, null)
    ipc.send(response)
  } catch (error) {
    const response = await JsonRpc.getErrorResponse(message, error, ipc, PrettyError.prepare, logError)
    const isDestroyed = ipc.isDisposed()
    if (isDestroyed) {
      return
    }
    ipc.send(response)
  }
}
