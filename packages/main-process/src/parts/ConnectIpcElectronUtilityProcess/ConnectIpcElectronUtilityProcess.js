const TransferMessagePortMain = require('../TransferMessagePortMain/TransferMessagePortMain.js')
const Performance = require('../Performance/Performance.js')
const PerformanceMarkerType = require('../PerformanceMarkerType/PerformanceMarkerType.js')

exports.connectIpc = async (ipc, browserWindowPort) => {
  await TransferMessagePortMain.transferMessagePortMain(ipc, browserWindowPort)
  Performance.mark(PerformanceMarkerType.DidStartSharedProcess)
}
