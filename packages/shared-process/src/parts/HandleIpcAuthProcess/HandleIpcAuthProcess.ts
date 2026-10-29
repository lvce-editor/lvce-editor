import * as AuthProcess from '../AuthProcess/AuthProcess.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const connectMessagePort = async (port: any, message: any): Promise<any> => {
  let connectionId: string | undefined
  try {
    const connection = await AuthProcess.acquire()
    connectionId = connection.connectionId
    const { ipc } = connection
    await JsonRpc.invokeAndTransfer(ipc, 'HandleMessagePort.handleMessagePort', port, message.ipcId, connectionId)
    // Keep the parent channel handled so subsequent close notifications are received.
    return { response: { type: 'handle' }, target: ipc }
  } catch (error) {
    if (connectionId) {
      AuthProcess.release(connectionId)
    }
    port.close()
    throw error
  }
}
