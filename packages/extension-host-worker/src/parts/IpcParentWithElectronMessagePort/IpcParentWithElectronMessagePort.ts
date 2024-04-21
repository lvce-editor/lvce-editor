import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as SendMessagePortToElectron from '../SendMessagePortToElectron/SendMessagePortToElectron.ts'

const getPort = async (type) => {
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await SendMessagePortToElectron.sendMessagePortToElectron(
    port1,
    'HandleMessagePortForExtensionHostHelperProcess.handleMessagePortForExtensionHostHelperProcess',
  )
  return port2
}

export const create = async ({ type }) => {
  const port = await getPort(type)
  return port
}

export const wrap = (port) => {
  let handleMessage
  return {
    get onmessage() {
      return handleMessage
    },
    set onmessage(listener) {
      let handleMessage
      if (listener) {
        handleMessage = (event) => {
          listener(event.data)
        }
      } else {
        handleMessage = null
      }
      port.onmessage = handleMessage
    },
    send(message) {
      port.postMessage(message)
    },
  }
}
