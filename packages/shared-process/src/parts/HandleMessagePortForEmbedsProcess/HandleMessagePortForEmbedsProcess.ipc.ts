import * as HandleMessagePortForEmbedsProcess from './HandleMessagePortForEmbedsProcess.ts'

export const name = 'HandleMessagePortForEmbedsProcess'

export const Commands = {
  handleMessagePortForEmbedsProcess: HandleMessagePortForEmbedsProcess.handleMessagePortForEmbedsProcess,
  handleEmbedsProcessIpcClosed: HandleMessagePortForEmbedsProcess.handleEmbedsProcessIpcClosed,
}
