const { VError } = require('../VError/VError.js')
const JsonRpc = require('../JsonRpc/JsonRpc.js')

exports.transferMessagePort = async (ipc, port, ...params) => {
  try {
    await JsonRpc.invokeAndTransfer(ipc, [port], 'HandleNodeMessagePort.handleNodeMessagePort', port, ...params)
  } catch (error) {
    throw new VError(error, `Failed to send message port to worker thread`)
  }
}
