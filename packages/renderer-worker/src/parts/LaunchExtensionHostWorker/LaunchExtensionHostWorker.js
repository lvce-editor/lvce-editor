import * as ExtensionHostWorkerUrl from '../ExtensionHostWorkerUrl/ExtensionHostWorkerUrl.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as Id from '../Id/Id.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug from '../IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js'
import * as IpcState from '../IpcState/IpcState.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Transferrable from '../Transferrable/Transferrable.js'
import * as Workspace from '../Workspace/Workspace.js'

export const launchExtensionHostWorker = async () => {
  const name = Platform.getPlatform() === PlatformType.Electron ? 'Extension Host (Electron)' : 'Extension Host'
  const id = Id.create()
  let ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: ExtensionHostWorkerUrl.extensionHostWorkerUrl,
    id,
  })
  if (IpcState.getConfig()) {
    // TODO should renderer process send port to renderer worker or vice versa?
    const port = Transferrable.acquire(id)
    ipc = IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.wrap(port)
  }
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'Workspace.setWorkspacePath', Workspace.state.workspacePath)
  GlobalEventBus.addListener('workspace.change', async () => {
    await JsonRpc.invoke(ipc, 'Workspace.setWorkspacePath', Workspace.state.workspacePath)
  })
  return ipc
}
