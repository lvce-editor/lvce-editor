const TransferMessagePortMain = require('../TransferMessagePortMain/TransferMessagePortMain.js')

exports.connectIpc = async (ipc, browserWindowPort, folder = '') => {
  await TransferMessagePortMain.transferMessagePortMain(ipc, browserWindowPort, folder)
}
