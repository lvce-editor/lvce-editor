/* istanbul ignore file */
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const create = () => {
  return IpcParent.create({
    method: IpcParentType.WebSocket,
    protocol: 'lvce.extension-host',
  })
}
