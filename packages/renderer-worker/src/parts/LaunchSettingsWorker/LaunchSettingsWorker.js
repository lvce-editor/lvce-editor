import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as SettingsWorkerUrl from '../SettingsWorkerUrl/SettingsWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const launchSettingsWorker = async () => {
  const name = 'Settings Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.settingsWorkerPath', SettingsWorkerUrl.settingsWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'Initialize.initialize')
  return ipc
}
