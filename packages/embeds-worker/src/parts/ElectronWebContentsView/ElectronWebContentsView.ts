import * as Rpc from '../Rpc/Rpc.ts'

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  // TODO send to shared process
  console.log({ restoreId, fallThroughKeyBindings })
  const { port1, port2 } = new MessageChannel()
  await Rpc.invokeAndTransfer('IpcParent.create', [port1], {
    method: 8,
    type: 1,
    initialCommand: 'HandleNodeMessagePort.handleNodeMessagePort',
  })
  console.log({ port2 })
  throw new Error('not implemented')
}

export const disposeWebContentsView = (id) => {
  // TODO send to shared process
  throw new Error('not implemented')
}
