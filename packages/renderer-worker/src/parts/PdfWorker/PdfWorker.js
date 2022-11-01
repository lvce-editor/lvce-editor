import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as PdfWorkerIpc from '../PdfWorkerIpc/PdfWorkerIpc.js'

export const create = async () => {
  const ipc = await PdfWorkerIpc.create()
  return {
    sendCanvas(offscreenCanvas, content) {
      ipc.sendAndTransfer(
        {
          jsonrpc: JsonRpcVersion.Two,
          method: 'Canvas.addCanvas',
          params: [offscreenCanvas, content],
        },
        [offscreenCanvas]
      )
    },
  }
}
