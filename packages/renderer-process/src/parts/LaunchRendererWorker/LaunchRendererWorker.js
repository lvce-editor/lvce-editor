import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as RendererWorkerUrl from '../RendererWorkerUrl/RendererWorkerUrl.js'

export const launchRendererWorker = async () => {
  const name = IsElectron.isElectron ? 'Renderer Worker (Electron)' : 'Renderer Worker'
  const rendererWorker = await IpcParent.create({
    method: IpcParentType.Auto,
    url: RendererWorkerUrl.rendererWorkerUrl,
    name,
  })
  return {
    send(message) {
      rendererWorker.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      rendererWorker.postMessage(message, transferables)
    },
    get onmessage() {
      return rendererWorker.onmessage
    },
    set onmessage(listener) {
      rendererWorker.onmessage = listener
    },
  }
}
