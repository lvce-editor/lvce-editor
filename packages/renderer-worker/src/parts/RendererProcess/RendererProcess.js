/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'

export const state = {
  pendingMessages: [],
  /**
   * @type {any}
   */
  ipc: undefined,
}

const handleMessageFromRendererProcess = (event) => {
  const message = event.data
  switch (message[0]) {
    case 67330:
    case 67331:
      Callback.resolve(message[1], message[2])
      break
    default:
      Command.execute(...message)
      break
  }
}

const listenModuleWorker = () => {
  onmessage = handleMessageFromRendererProcess
  return {
    send(message) {
      postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      postMessage(message, transferables)
    },
  }
}

const listenMessagePort = () => {
  const messageChannel = new MessageChannel()
  messageChannel.port1.onmessage = handleMessageFromRendererProcess
  globalThis.acceptPort(messageChannel.port2)
  return {
    send(message) {
      messageChannel.port1.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      messageChannel.port1.postMessage(message, transferables)
    },
  }
}

const listenReferencePort = () => {
  const referencePort = {
    onmessage(message, transferables) {},
    postMessage: state.handleMessage,
  }
  // TODO get rid of extra data wrapper
  globalThis.acceptReferencePort(referencePort)
  return {
    send(message) {
      referencePort.onmessage({ data: message })
    },
    sendAndTransfer({ data: message }, transferables) {
      referencePort.onmessage(message, transferables)
    },
  }
}

const getIpc = () => {
  // TODO tree-shake out if/else in prod
  if (globalThis.acceptPort) {
    return listenMessagePort()
  } else if (globalThis.acceptReferencePort) {
    return listenReferencePort()
  } else {
    return listenModuleWorker()
  }
}

export const listen = () => {
  console.assert(state.pendingMessages.length === 0)
  const ipc = getIpc()
  state.ipc = ipc
}

/**
 * @deprecated use invoke instead
 * @param {*} message
 */
export const send = (message) => {
  state.ipc.send(message)
}

export const invoke = async (method, ...params) => {
  const responseMessage = await new Promise((resolve, reject) => {
    const callbackId = Callback.register(resolve, reject)
    state.ipc.send([
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
  state.ipc.sendAndTransfer(message, transferables)
}
