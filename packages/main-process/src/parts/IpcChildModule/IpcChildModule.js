const IpcChildType = require('../IpcChildType/IpcChildType.js')

exports.getModule = (method) => {
  switch (method) {
    case IpcChildType.ElectronMessagePort:
      return import('../IpcChildWithElectronMessagePort/IpcChildWithElectronMessagePort.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
