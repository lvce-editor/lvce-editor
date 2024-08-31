import * as CreateElectronSession from '../CreateElectronSession/CreateElectronSession.js'
import * as Protocol from '../Protocol/Protocol.js'
import * as Scheme from '../Scheme/Scheme.js'
import * as Assert from '../Assert/Assert.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

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
  state.hasWebViewProtocol = true
  const ipc = await IpcParent.create({
    method: IpcParentType.ElectronMessagePort,
    messagePort: port,
  })
  const session = get()
  // TODO avoid closure
  const handleRequest = async () => {
    return new Response('test', {
      headers: {
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    })
  }
  Protocol.handle(session.protocol, Scheme.WebView, handleRequest)
}
