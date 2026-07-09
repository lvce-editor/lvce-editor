import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as SendIncomingIpc from '../SendIncomingIpc/SendIncomingIpc.ts'

export const applyIncomingIpcResponse = async (target: any, response: any, ipcId: any): Promise<any> => {
  switch (response.type) {
    case 'handle':
      HandleIpc.handleIpc(target)
      break
    case 'send':
      return SendIncomingIpc.sendIncomingIpc(target, response, ipcId)
    default:
      throw new Error('unexpected response')
  }
}
