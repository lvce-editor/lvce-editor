import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as OutputViewWorkerUrl from '../OutputViewWorkerUrl/OutputViewWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const launchOutputViewWorker = async () => {
  const name = 'Output View Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.outputViewWorkerPath', OutputViewWorkerUrl.outputViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'Output.initialize')

  return ipc
}
