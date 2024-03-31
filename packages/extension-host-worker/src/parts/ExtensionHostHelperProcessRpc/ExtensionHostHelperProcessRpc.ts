import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const listen = async (ipc) => {
  ipc.onmessage = JsonRpc.handleMessage
  return {
    async invoke(method, params) {
      return JsonRpc.invoke(ipc, method, ...params)
    },
  }
}
