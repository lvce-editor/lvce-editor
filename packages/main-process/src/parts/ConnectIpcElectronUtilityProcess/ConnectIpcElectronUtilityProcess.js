import * as TransferMessagePortMain from '../TransferMessagePortMain/TransferMessagePortMain.js'
import * as Performance from '../Performance/Performance.js'
import * as PerformanceMarkerType from '../PerformanceMarkerType/PerformanceMarkerType.js'

export const connectIpc = async (ipc, browserWindowPort, ...params) => {
  await TransferMessagePortMain.transferMessagePortMain(ipc, browserWindowPort, ...params)
  Performance.mark(PerformanceMarkerType.DidStartSharedProcess)
}
