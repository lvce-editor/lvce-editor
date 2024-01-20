import * as IpcParent from '../IpcParent/IpcParent.js'

export const create = (method) => {
  return IpcParent.create({
    method,
    type: 'extension-host-helper-process',
  })
}
