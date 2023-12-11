import * as TransferMessagePortMain from '../TransferMessagePortMain/TransferMessagePortMain.js'

export const connectIpc = async (ipc, browserWindowPort, ...params) => {
  await TransferMessagePortMain.transferMessagePortMain(ipc, browserWindowPort, ...params)
}
