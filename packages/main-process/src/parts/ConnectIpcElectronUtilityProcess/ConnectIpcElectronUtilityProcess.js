const JsonRpc = require('../JsonRpc/JsonRpc.js')

exports.connectIpc = async (ipc, browserWindowPort, folder = '') => {
  await JsonRpc.invokeAndTransfer(ipc, browserWindowPort, 'HandleElectronMessagePort.handleElectronMessagePort', folder)
}
