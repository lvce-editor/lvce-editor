import * as Rpc from '../Rpc/Rpc.ts'

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  // TODO send to shared process
  console.log({ restoreId, fallThroughKeyBindings })
  const port = await Rpc.invoke('IpcParent.create', {
    method: 8,
    type: 1,
    raw: true,
    initialCommand: 'HandleMessageportForSharedProcess.handleMessagePortForSharedProcess',
  })
  console.log({ port })
  throw new Error('not implemented')
}

export const disposeWebContentsView = (id) => {
  // TODO send to shared process
  throw new Error('not implemented')
}
