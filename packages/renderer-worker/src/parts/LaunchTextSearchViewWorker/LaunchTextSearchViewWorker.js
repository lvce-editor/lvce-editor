import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as TextSearchViewWorkerUrl from '../TextSearchViewWorkerUrl/TextSearchViewWorkerUrl.js'

export const launchTextSearchViewWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Text Search View Worker',
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.textSearchViewPath', TextSearchViewWorkerUrl.textSearchViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'TextSearch.initialize', Platform.getPlatform())
  return ipc
}
