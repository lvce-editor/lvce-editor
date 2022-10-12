import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const create = async () => {
  return IpcParent.create({
    method: IpcParentType.Electron,
    type: 'extension-host',
  })
}
