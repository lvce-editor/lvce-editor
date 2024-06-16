import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const listen = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.RendererProcess,
  })
  // const { port1, port2 } = await GetPortTuple.getPortTuple()
  // // TODO reorder maybe to avoid race condition
  // await RendererWorker.invokeAndTransfer([port1], 'SendMessagePortToRendererProcess.sendMessagePortToRendererProcess', port1)
  // const ipc = await IpcChild.listen({
  //   method: IpcChildType.MessagePort,
  //   port: port2,
  // })
  HandleIpc.handleIpc(ipc)
}
