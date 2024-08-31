import * as Assert from '../Assert/Assert.js'
import * as CreateElectronSession from '../CreateElectronSession/CreateElectronSession.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as Protocol from '../Protocol/Protocol.js'
import * as Scheme from '../Scheme/Scheme.js'
import * as WebViewRequestHandler from '../WebViewRequestHandler/WebViewRequestHandler.js'

export const state = {
  /**
   * @type {any}
   */
  session: undefined,

  hasWebViewProtocol: false,
}

export const get = () => {
  state.session ||= CreateElectronSession.createElectronSession()
  return state.session
}

export const registerWebviewProtocol = async (port) => {
  Assert.object(port)
  // TODO move this if/else to shared-process
  if (state.hasWebViewProtocol) {
    return
  }
  // TODO avoid race condition
  state.hasWebViewProtocol = true
  const ipc = await IpcParent.create({
    method: IpcParentType.ElectronMessagePort,
    messagePort: port,
  })
  HandleIpc.handleIpc(ipc)
  port.start()
  WebViewRequestHandler.setIpc(ipc)
  const session = get()
  Protocol.handle(session.protocol, Scheme.WebView, WebViewRequestHandler.handleRequest)
}
