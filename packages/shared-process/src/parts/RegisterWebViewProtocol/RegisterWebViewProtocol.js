import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as ParentIpc from '../MainProcess/MainProcess.js'
import * as PreviewProcess from '../PreviewProcess/PreviewProcess.js'
import * as WebViewProtocolState from '../WebViewProtocolState/WebViewProtocolState.js'

const doRegisterWebViewProtocol = async () => {
  const { port1, port2 } = await GetPortTuple.getPortTuple()
  await ParentIpc.invokeAndTransfer('ElectronSession.registerWebviewProtocol', port1)
  // TODO launch preview process at the start of this
  await PreviewProcess.invokeAndTransfer('HandleElectronMessagePort.handleElectronMessagePort', port2)
}

// TODO send port directly to from preview process to renderer worker?
export const registerWebViewProtocol = async () => {
  return WebViewProtocolState.getOrCreate(doRegisterWebViewProtocol)
}
