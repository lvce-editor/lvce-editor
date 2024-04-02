import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'

export const listen = async (ipc) => {
  HandleIpc.handleIpc(ipc)
  return {
    async invoke(method, params) {
      return JsonRpc.invoke(ipc, method, ...params)
    },
  }
}
