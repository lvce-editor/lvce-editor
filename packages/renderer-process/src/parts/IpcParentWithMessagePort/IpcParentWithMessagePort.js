import * as Assert from '../Assert/Assert.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.js'

export const create = async ({ url }) => {
  Assert.string(url)
  const port = await new Promise((resolve) => {
    globalThis.acceptPort = resolve
    import(url)
  })
  delete globalThis.acceptPort
  if (!port) {
    throw new IpcError('port must be defined')
  }
  if (!IsMessagePort.isMessagePort(port)) {
    throw new IpcError('port must be of type MessagePort')
  }
  return port
}
