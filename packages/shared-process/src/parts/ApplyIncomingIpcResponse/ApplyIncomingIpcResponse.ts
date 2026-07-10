import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as SendIncomingIpc from '../SendIncomingIpc/SendIncomingIpc.ts'

export const applyIncomingIpcResponse = async (target: any, response: any, ipcId: any): Promise<any> => {
  try {
    switch (response.type) {
      case 'handle':
        HandleIpc.handleIpc(target)
        break
      case 'send':
        await SendIncomingIpc.sendIncomingIpc(target, response, ipcId)
        break
      default:
        throw new Error('unexpected response')
    }
  } catch (error) {
    return error
  }
}
