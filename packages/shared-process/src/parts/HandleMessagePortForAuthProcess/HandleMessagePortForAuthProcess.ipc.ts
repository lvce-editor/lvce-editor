import * as HandleMessagePortForAuthProcess from './HandleMessagePortForAuthProcess.ts'

export const name = 'HandleMessagePortForAuthProcess'

export const Commands = {
  handleAuthProcessIpcClosed: HandleMessagePortForAuthProcess.handleAuthProcessIpcClosed,
  handleMessagePortForAuthProcess: HandleMessagePortForAuthProcess.handleMessagePortForAuthProcess,
}
