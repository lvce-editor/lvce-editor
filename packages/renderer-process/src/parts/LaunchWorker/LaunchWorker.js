import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchWorker = async ({ name, url }) => {
  const worker = await IpcParent.create({
    method: IpcParentType.Auto,
    url,
    name,
  })
  return {
    send(message) {
      worker.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      worker.postMessage(message, transferables)
    },
    get onmessage() {
      return worker.onmessage
    },
    set onmessage(listener) {
      worker.onmessage = listener
    },
  }
}
