import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.js'
import * as Rpc from '../Rpc/Rpc.js'

export const create = async ({ url, name }) => {
  const port = await JsonRpc.invoke(Rpc.state.ipc, 'IpcParent.create', {
    method: RendererWorkerIpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url,
    name,
    raw: true,
  })
  return port
}

export const wrap = (port) => {
  // TODO
  return port
}
