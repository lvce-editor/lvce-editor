import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.ElectronMessagePort:
      return import('../IpcChildWithElectronMessagePort/IpcChildWithElectronMessagePort.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
