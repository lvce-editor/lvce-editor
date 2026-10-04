import * as AuthWorkerUrl from '../AuthWorkerUrl/AuthWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Product from '../Product/Product.js'

export const launchAuthWorker = async () => {
  const name = 'Auth Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.authWorkerPath', AuthWorkerUrl.authWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'Auth.configure', {
    backendUrl: Preferences.get('layout.backendUrl') || Product.getBackendUrl(),
    platform: Platform.getPlatform(),
  })
  return ipc
}
