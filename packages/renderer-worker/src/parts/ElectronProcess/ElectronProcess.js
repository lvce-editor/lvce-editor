import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

const createIpc = async () => {
  return IpcParent.create({
    method: IpcParentType.ElectronMessagePort,
    type: 'electron-process',
  })
}

const handleMessage = async (message) => {
  if ('id' in message) {
    Callback.resolve(message.id, message)
  } else if ('method' in message) {
    await Command.execute(message.method, ...message.params)
  } else {
  }
}

// TODO race condition
const getIpc = async () => {
  if (!state.ipc) {
    const ipc = await createIpc()
    ipc.onmessage = handleMessage
    state.ipc = ipc
  }
  return state.ipc
}

export const invoke = async (method, ...params) => {
  const ipc = await getIpc()
  const result = await JsonRpc.invoke(ipc, method, ...params)
  return result
}
