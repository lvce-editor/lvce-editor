import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const listen = async (ipc) => {
  ipc.onmessage = JsonRpc.handleMessage
  return {
    async invoke(method, params) {
      return JsonRpc.invoke(ipc, method, ...params)
    },
  }
}
