/* istanbul ignore file */
import * as IpcParent from '../IpcParent/IpcParent.js'

export const create = () => {
  return IpcParent.create({
    method: IpcParent.Methods.WebSocket,
    protocol: 'lvce.extension-host',
  })
}
