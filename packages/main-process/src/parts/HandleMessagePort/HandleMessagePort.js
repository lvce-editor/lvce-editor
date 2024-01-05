import * as Assert from '../Assert/Assert.js'
import * as CreateWebContentsIpc from '../CreateWebContentsIpc/CreateWebContentsIpc.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as PrettyError from '../PrettyError/PrettyError.js'

const logError = (error, prettyError) => {
  // ignore
}

const getModule = (type) => {
  switch (type) {
    case 'shared-process':
      return import('../HandleMessagePortForSharedProcess/HandleMessagePortForSharedProcess.js')
    default:
      throw new Error(`unsupported message port type: ${type}`)
  }
}

/**
 * @param {import('electron').IpcMainEvent} event
 */
export const handlePort = async (event, message) => {
  Assert.object(event)
  Assert.object(message)
  const { sender, ports } = event
  const port = ports[0]
  const data = message.params[0]
  const ipc = CreateWebContentsIpc.createWebContentsIpc(sender)
  try {
    const module = await getModule(data)
    if (!module) {
      throw new Error(`Unexpected port type ${data}`)
    }
    // @ts-ignore
    await module.handlePort(event, port, ...message.params)
    const response = JsonRpc.getSuccessResponse(message, null)
    ipc.sendAndTransfer(response)
  } catch (error) {
    const response = await JsonRpc.getErrorResponse(message, error, ipc, PrettyError.prepare, logError)
    const isDestroyed = ipc.isDisposed()
    if (isDestroyed) {
      return
    }
    ipc.send(response)
  }
}
