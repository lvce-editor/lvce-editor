import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as Command from '../Command/Command.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

const handleMessage = async (message) => {
  await Command.execute(message.method, ...message.params)
}

export const create = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.WebSocket,
    protocol: 'lvce.terminal-process',
  })
  ipc.onmessage = handleMessage

  state.ipc = ipc

  ipc.send({
    jsonrpc: JsonRpcVersion.Two,
    method: 'PtyController.create',
    params: [1, '/tmp'],
  })
  console.log({ ipc })
}

export const invoke = (method, ...params) => {}
