import * as ExtensionHostWorkerUrl from '../ExtensionHostWorkerUrl/ExtensionHostWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Workspace from '../Workspace/Workspace.js'

export const launchExtensionHostWorker = async () => {
  const name = Platform.platform === PlatformType.Electron ? 'Extension Host (Electron)' : 'Extension Host'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: ExtensionHostWorkerUrl.extensionHostWorkerUrl,
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke('Workspace.setWorkspacePath', Workspace.state.workspacePath)
  return ipc
}
