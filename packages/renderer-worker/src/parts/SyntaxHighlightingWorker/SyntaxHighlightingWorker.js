import * as Worker from '../Worker/Worker.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Languages from '../Languages/Languages.js'

export const state = {
  pendingMessages: [],
  send(message) {
    state.pendingMessages.push(message)
  },
}

export const hydrate = async () => {
  // const syntaxHighlightingWorker = await Worker.create(
  //   '/packages/syntax-highlighting-worker/src/syntaxHighlightingWorkerMain.js'
  // )
  // const messageChannel = new MessageChannel()
  // RendererProcess.sendAndTransfer(
  //   [/* SyntaxHighlighting.setPort */ 9997],
  //   [/* port */ messageChannel.port1]
  // )
  // syntaxHighlightingWorker.postMessage(
  //   [/* SyntaxHighlighting.setPort */ 9997],
  //   [/* port */ messageChannel.port2]
  // )
  // state.send = (message) => syntaxHighlightingWorker.postMessage(message)
  // while (state.pendingMessages.length > 0) {
  //   send(state.pendingMessages.shift())
  // }
}

export const send = (message) => {
  state.send(message)
}
