import * as SourceControlWorkerUrl from '../SourceControlWorkerUrl/SourceControlWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const launchSourceControlWorker = async () => {
  const name = 'Source Control Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.sourceControlWorkerPath', SourceControlWorkerUrl.sourceControlWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'Initialize.initialize')
  return ipc
}
