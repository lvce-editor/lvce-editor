import * as ElectronSession from './ElectronSession.js'

export const name = 'ElectronSession'

export const Commands = {
  registerWebviewProtocol: ElectronSession.registerWebviewProtocol,
}
