import * as HandleIpc from '../HandleIpc/HandleIpc.js'

export const applyIncomingIpcResponse = async (target, response, ipcId) => {
  switch (response.type) {
    case 'handle':
      HandleIpc.handleIpc(target)
      break
    default:
      throw new Error('unexpected response')
  }
}
