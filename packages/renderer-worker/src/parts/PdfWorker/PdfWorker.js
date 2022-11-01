import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const create = async () => {
  const worker = await IpcParent.create({
    method: IpcParentType.ModuleWorker,
    url: new URL(
      '../../../../pdf-worker/src/pdfWorkerMain.js',
      import.meta.url
    ),
    name: 'Pdf Worker',
  })
  return {
    sendCanvas(offscreenCanvas) {
      worker.sendAndTransfer(
        {
          jsonrpc: '2.0',
          method: 'setCanvas',
          params: [offscreenCanvas],
        },
        [offscreenCanvas]
      )
    },
  }
}
