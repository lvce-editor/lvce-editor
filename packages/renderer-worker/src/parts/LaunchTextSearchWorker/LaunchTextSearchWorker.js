import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as TextSearchWorkerUrl from '../TextSearchWorkerUrl/TextSearchWorkerUrl.js'
import * as Platform from '../Platform/Platform.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const launchTextSearchWorker = async () => {
  const name = 'Text Search Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.textSearchWorkerPath', TextSearchWorkerUrl.textSearchWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  try {
    await JsonRpc.invoke(ipc, 'TextSearch.initialize', Platform.platform)
  } catch (error) {
    // ignore
  }
  return ipc
}
