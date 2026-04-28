import * as HandleMessagePortForAuthProcess from './HandleMessagePortForAuthProcess.js'

export const name = 'HandleMessagePortForAuthProcess'

export const Commands = {
  handleMessagePortForAuthProcess: HandleMessagePortForAuthProcess.handleMessagePortForAuthProcess,
  handleAuthProcessIpcClosed: HandleMessagePortForAuthProcess.handleAuthProcessIpcClosed,
}
