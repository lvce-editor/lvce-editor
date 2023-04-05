import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const create = ({ ipc }) => {
  return {
    ipc,
    invoke(method, ...params) {
      return JsonRpc.invoke(this.ipc, method, ...params)
    },
  }
}
