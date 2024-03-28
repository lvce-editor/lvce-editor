import * as GetData from '../GetData/GetData.ts'

export const create = async (options) => {
  throw new Error('not implemented')
}

export const wrap = (port) => {
  if (!(port instanceof MessagePort)) {
    return port.module.wrap(port.rawIpc)
  }
  return {
    port,
    /**
     * @type {any}
     */
    listener: undefined,
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      this.listener = listener
      const wrappedListener = (event) => {
        const data = GetData.getData(event)
        // @ts-ignore
        listener(data)
      }
      this.port.onmessage = wrappedListener
    },
    send(message) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      this.port.postMessage(message, transfer)
    },
  }
}
