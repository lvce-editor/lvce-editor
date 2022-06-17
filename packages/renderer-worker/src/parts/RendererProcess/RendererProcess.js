/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'

export const state = {
  pendingMessages: [],
  /**
   *
   * @param {any} message
   * @returns {void}
   */
  send(message) {
    throw new Error('not implemented')
  },
  // TODO renderer process should only be able send events
  // should not be able to invoke callbacks
  handleMessage(message) {
    switch (message[0]) {
      case 67330:
      case 67331:
        Callback.resolve(message[1], message[2])
        break
      default:
        Command.execute(...message)
        break
    }
  },
  sendAndTransfer(message, transferables) {},
}

const handleMessageFromRendererProcess = (event) => {
  state.handleMessage(event.data)
}

const listenModuleWorker = () => {
  onmessage = handleMessageFromRendererProcess
  state.send = (message) => postMessage(message)
  state.sendAndTransfer = (message, transferables) => {
    postMessage(message, transferables)
  }
}

const listenMessagePort = () => {
  const messageChannel = new MessageChannel()
  messageChannel.port1.onmessage = handleMessageFromRendererProcess
  state.send = (message) => {
    messageChannel.port1.postMessage(message)
  }
  state.sendAndTransfer = (message, transferables) => {
    messageChannel.port1.postMessage(message, transferables)
  }
  globalThis.acceptPort(messageChannel.port2)
}

const listenReferencePort = () => {
  const referencePort = {
    onmessage(message, transferables) {},
    postMessage: state.handleMessage,
  }
  // TODO get rid of extra data wrapper
  state.send = (message) => {
    referencePort.onmessage({ data: message })
  }
  state.sendAndTransfer = ({ data: message }, transferables) => {
    referencePort.onmessage(message, transferables)
  }
  globalThis.acceptReferencePort(referencePort)
}

export const listen = () => {
  console.assert(state.pendingMessages.length === 0)
  // TODO tree-shake out if/else in prod
  if (globalThis.acceptPort) {
    listenMessagePort()
  } else if (globalThis.acceptReferencePort) {
    listenReferencePort()
  } else {
    listenModuleWorker()
  }
}

/**
 * @deprecated use invoke instead
 * @param {*} message
 */
export const send = (message) => {
  state.send(message)
}

export const invoke = async (method, ...params) => {
  const responseMessage = await new Promise((resolve, reject) => {
    const callbackId = Callback.register(resolve, reject)
    state.send([
      /* RendererWorker.invoke */ 909090,
      /* callbackId */ callbackId,
      /* method */ method,
      /* params */ ...params,
    ])
  })
  if (responseMessage instanceof Error) {
    throw responseMessage
  }
  return responseMessage
}

export const sendAndTransfer = (message, transferables) => {
  state.sendAndTransfer(message, transferables)
}
