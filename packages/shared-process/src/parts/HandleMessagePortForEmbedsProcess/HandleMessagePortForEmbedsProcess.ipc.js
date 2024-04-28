import * as HandleMessagePortForEmbedsProcess from './HandleMessagePortForEmbedsProcess.js'

export const name = 'HandleMessagePortForEmbedsProcess'

export const Commands = {
  handleMessagePortForEmbedsProcess: HandleMessagePortForEmbedsProcess.handleMessagePortForEmbedsProcess,
  handleEmbedsProcessIpcClosed: HandleMessagePortForEmbedsProcess.handleEmbedsProcessIpcClosed,
}
