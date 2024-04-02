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
      this.worker.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      this.worker.postMessage(message, transferables)
    },
    get onmessage() {
      return this.handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        this.handleMessage = (event) => {
          const data = getData(event)
          listener({ data, target: this })
        }
      } else {
        this.handleMessage = null
      }
      this.worker.onmessage = this.handleMessage
    },
  }
}
