import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const create = ({ ipc }) => {
  ipc.onmessage = JsonRpc.handleMessage
  return {
    ipc,
    invoke(method, ...params) {
      return JsonRpc.invoke(this.ipc, method, ...params)
    },
  }
}
