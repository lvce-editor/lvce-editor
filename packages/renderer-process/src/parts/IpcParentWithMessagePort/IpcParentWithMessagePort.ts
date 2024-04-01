import * as Assert from '../Assert/Assert.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.js'

export const create = async ({ url }) => {
  Assert.string(url)
  const portPromise = await new Promise((resolve) => {
    globalThis.acceptPort = resolve
  })
  await import(url)
  const port = await portPromise
  delete globalThis.acceptPort
  if (!port) {
    throw new IpcError('port must be defined')
  }
  if (!IsMessagePort.isMessagePort(port)) {
    throw new IpcError('port must be of type MessagePort')
  }
  return port
}
