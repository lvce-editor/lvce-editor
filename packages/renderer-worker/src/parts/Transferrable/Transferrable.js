import * as Callback from '../Callback/Callback.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const transferToRendererProcess = (objectId, transferable) => {
  const { id, promise } = Callback.registerPromise()
  // TODO use invoke and transfer
  RendererProcess.sendAndTransfer(
    {
      jsonrpc: '2.0',
      method: 'Transferrable.transfer',
      params: [objectId, transferable],
      id,
    },
    [transferable],
  )
  return promise
}
