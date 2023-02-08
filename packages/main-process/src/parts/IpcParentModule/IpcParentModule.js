const IpcParentType = require('../IpcParentType/IpcParentType.js')

exports.getModule = (method) => {
  switch (method) {
    case IpcParentType.NodeWorker:
      return import('../IpcParentWithNodeWorker/IpcParentWithNodeWorker.js')
    case IpcParentType.NodeForkedProcess:
      return import('../IpcParentWithNodeForkedProcess/IpcParentWithNodeForkedProcess.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
