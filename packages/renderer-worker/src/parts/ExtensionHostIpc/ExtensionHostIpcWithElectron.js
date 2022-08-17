import * as IpcParent from '../IpcParent/IpcParent.js'

export const create = async () => {
  return IpcParent.create({
    method: IpcParent.Methods.Electron,
    type: 'extension-host',
  })
}
