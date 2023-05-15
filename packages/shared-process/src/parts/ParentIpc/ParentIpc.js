import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

// TODO add tests for this

// TODO handle structure: one shared process multiple extension hosts

// TODO pass socket / port handle also in electron

export const state = {
  electronPortMap: new Map(),
}

// TODO maybe rename to hydrate
export const listen = async () => {
  const method = IpcChildType.Auto()
  const ipc = await IpcChild.listen({
    method,
  })
  HandleIpc.handleIpc(ipc)
}
