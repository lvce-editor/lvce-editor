const { VError } = require('../VError/VError.js')
const JsonRpc = require('../JsonRpc/JsonRpc.js')

exports.transferMessagePortMain = async (ipc, port, ...params) => {
  try {
    await JsonRpc.invokeAndTransfer(ipc, port, 'HandleElectronMessagePort.handleElectronMessagePort', ...params)
  } catch (error) {
    throw new VError(error, `Failed to send message port to utility process`)
  }
}
