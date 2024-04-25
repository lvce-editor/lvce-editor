import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as SendIncomingIpc from '../SendIncomingIpc/SendIncomingIpc.js'

export const applyIncomingIpcResponse = async (target, response, ipcId) => {
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
