import * as Callback from '../Callback/Callback.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const transferToRendererProcess = (objectId, transferable) => {
  return new Promise((resolve, reject) => {
    const id = Callback.register(resolve, reject)
    RendererProcess.sendAndTransfer({ jsonrpc: '2.0', method: 'Transferrable.transfer', params: [objectId, transferable], id }, [transferable])
  })
}
