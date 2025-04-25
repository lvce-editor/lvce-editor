/* istanbul ignore file */
import * as FileSystemProcessIpc from '../FileSystemProcessIpc/FileSystemProcessIpc.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

let promise

const getOrCreateIpc = () => {
  if (!promise) {
    promise = FileSystemProcessIpc.listen(IpcParentType.Node)
  }
  return promise
}

export const invoke = async (method, ...params) => {
  const ipc = await getOrCreateIpc()
  const result = await JsonRpc.invoke(ipc, method, ...params)
  return result
}

export const invokeAndTransfer = async (method, ...params) => {
  const ipc = await getOrCreateIpc()
  const result = await JsonRpc.invokeAndTransfer(ipc, method, ...params)
  return result
}

export const dispose = () => {
  // TODO
}
