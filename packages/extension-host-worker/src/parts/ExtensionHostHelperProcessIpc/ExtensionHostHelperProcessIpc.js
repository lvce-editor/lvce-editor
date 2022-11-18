import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const create = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.WebSocket,
    protocol: ['lvce.extension-host-helper-process'],
  })
  return ipc
}
