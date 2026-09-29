import * as HandleMessagePortForEmbedsProcess from './HandleMessagePortForEmbedsProcess.ts'

export const name = 'HandleMessagePortForEmbedsProcess'

export const Commands = {
  handleEmbedsProcessIpcClosed: HandleMessagePortForEmbedsProcess.handleEmbedsProcessIpcClosed,
  handleMessagePortForEmbedsProcess: HandleMessagePortForEmbedsProcess.handleMessagePortForEmbedsProcess,
}
