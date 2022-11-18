import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const connect = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.WebSocket,
    protocol: ['lvce.extension-host-helper-process'],
  })
  ipc.send({
    jsonrpc: '2.0',
    method: 'Exec.exec',
    params: ['git', '--version'],
  })
}
