import * as HandleMessagePortForAuthProcess from './HandleMessagePortForAuthProcess.ts'

export const name = 'HandleMessagePortForAuthProcess'

export const Commands = {
  handleMessagePortForAuthProcess: HandleMessagePortForAuthProcess.handleMessagePortForAuthProcess,
  handleAuthProcessIpcClosed: HandleMessagePortForAuthProcess.handleAuthProcessIpcClosed,
}
