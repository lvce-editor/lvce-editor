import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const connect = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.WebSocket,
    protocol: ['lvce.extension-host-helper-process'],
  })
}
