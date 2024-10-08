import * as PreviewProcess from '../PreviewProcess/PreviewProcess.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'

// TODO send port directly to from preview process to renderer worker?
export const registerProtocol = async () => {
  // TODO only do this once
  // TODO send messageport to proview process
  // TODO send other messageport to parent process
  console.time('get-ports')
  const { port1, port2 } = await GetPortTuple.getPortTuple()
  console.timeEnd('get-ports')
  console.time('register-protocol')
  await ParentIpc.invokeAndTransfer('ElectronSession.registerWebviewProtocol', port1)
  console.timeEnd('register-protocol')
  console.time('handle-port')
  await PreviewProcess.invokeAndTransfer('HandleElectronMessagePort.handleElectronMessagePort', port2)
  console.timeEnd('handle-port')
}

export const create = async (previewId) => {
  await PreviewProcess.invoke('WebViewServer.create', previewId)
}

export const start = async (previewId, port) => {
  await PreviewProcess.invoke('WebViewServer.start', previewId, port)
}

export const setHandler = async (previewId, frameAncestors, webViewRoot, contentSecurityPolicy, iframeContent) => {
  await PreviewProcess.invoke('WebViewServer.setHandler', previewId, frameAncestors, webViewRoot, contentSecurityPolicy, iframeContent)
}
