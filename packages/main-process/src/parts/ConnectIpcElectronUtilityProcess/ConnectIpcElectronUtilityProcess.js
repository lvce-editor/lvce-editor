const TransferMessagePortMain = require('../TransferMessagePortMain/TransferMessagePortMain.js')

exports.connectIpc = async (ipc, browserWindowPort) => {
  await TransferMessagePortMain.transferMessagePortMain(ipc, browserWindowPort)
}
