import * as IpcParent from '../IpcParent/IpcParent.ts'

export const create = (method) => {
  return IpcParent.create({
    method,
    type: 'extension-host-helper-process',
  })
}
