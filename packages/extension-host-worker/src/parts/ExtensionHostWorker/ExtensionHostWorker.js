import * as Assert from '../Assert/Assert.js'
import * as Rpc from '../Rpc/Rpc.js'
import * as Callback from '../Callback/Callback.js'

export const createWorker = async ({ method, url, name }) => {
  Assert.string(method)
  Assert.string(url)
  Assert.string(name)
  const response = await new Promise((resolve, reject) => {
    const id = Callback.register(resolve, reject)
    Rpc.state.ipc.send({ jsonrpc: '2.0', method: 'get-port', params: [url, name], id })
  })
  const ipc = response.result
  return ipc
}
