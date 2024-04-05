import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

const getData = (event) => {
  // TODO why are some events not instance of message event?
  if (event instanceof MessageEvent) {
    return event.data
  }
  return event
}

export const launchWorker = async ({ name, url }) => {
  const worker = await IpcParent.create({
    method: IpcParentType.Auto,
    url,
    name,
  })
  return {
    worker,
    handleMessage: undefined,
    send(message) {
      // @ts-ignore
      this.worker.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      // @ts-ignore
      this.worker.postMessage(message, transferables)
    },
    get onmessage() {
      return this.handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        // @ts-ignore
        this.handleMessage = (event) => {
          const data = getData(event)
          // @ts-ignore
          listener({ data, target: this })
        }
      } else {
        // @ts-ignore
        this.handleMessage = null
      }
      // @ts-ignore
      this.worker.onmessage = this.handleMessage
    },
  }
}
