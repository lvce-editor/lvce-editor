import * as GetData from '../GetData/GetData.ts'

export const create = async ({ port }: { port: MessagePort }) => {
  // TODO send messageprt to renderer process
  // then wait for ready message
  return port
}

export const wrap = (port: any) => {
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
      const wrappedListener = (event: any) => {
        const data = GetData.getData(event)
        // @ts-ignore
        listener(data)
      }
      this.port.onmessage = wrappedListener
    },
    send(message: any) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message: any, transfer: any) {
      this.port.postMessage(message, transfer)
    },
  }
}
