import * as Assert from '../Assert/Assert.js'
import * as CreateElectronSession from '../CreateElectronSession/CreateElectronSession.js'
import * as ElectronSessionState from '../ElectronSessionState/ElectronSessionState.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as Protocol from '../Protocol/Protocol.js'
import * as Scheme from '../Scheme/Scheme.js'
import * as WebViewRequestHandler from '../WebViewRequestHandler/WebViewRequestHandler.js'

export const get = () => {
  if (!ElectronSessionState.get()) {
    ElectronSessionState.set(CreateElectronSession.createElectronSession())
  }
  return ElectronSessionState.get()
}

export const registerWebviewProtocol = async (port) => {
  Assert.object(port)
  const ipc = await IpcParent.create({
    method: IpcParentType.ElectronMessagePort,
    messagePort: port,
  })
  HandleIpc.handleIpc(ipc)
  port.start()
  const session = get()
  const handleRequest = WebViewRequestHandler.create(ipc)
  Protocol.handle(session.protocol, Scheme.WebView, handleRequest)
}
