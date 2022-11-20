import * as IpcParent from '../IpcParent/IpcParent.js'

export const listen = (method) => {
  return IpcParent.create({
    method,
    type: 'shared-process',
    name: 'Shared Process',
    protocol: 'lvce.shared-process',
  })
}
