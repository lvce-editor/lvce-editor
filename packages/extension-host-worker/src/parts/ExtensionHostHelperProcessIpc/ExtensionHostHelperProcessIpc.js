import * as IpcParent from '../IpcParent/IpcParent.js'

export const create = (method) => {
  return IpcParent.create({
    method,
    protocol: ['lvce.extension-host-helper-process'],
  })
}
