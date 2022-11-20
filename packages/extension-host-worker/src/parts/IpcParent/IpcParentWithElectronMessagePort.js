import * as Callback from '../Callback/Callback.js'

export const create = async () => {
  const port = await new Promise((resolve, reject) => {
    const id = Callback.register(resolve, reject)
    const message = {
      jsonrpc: '2.0',
      method: 'ElectronMessagePort.create',
      params: [],
      id,
    }
    postMessage(message)
  })
  console.log({ port })
}
