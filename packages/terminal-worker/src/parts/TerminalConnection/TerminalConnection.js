import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const create = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.WebSocket,
    protocol: 'lvce.terminal-process',
  })

  state.ipc = ipc

  ipc.send({
    jsonrpc: JsonRpcVersion.Two,
    method: 'PtyController.create',
    params: [0, '/tmp'],
  })
  console.log({ ipc })
}

export const invoke = (method, ...params) => {}
