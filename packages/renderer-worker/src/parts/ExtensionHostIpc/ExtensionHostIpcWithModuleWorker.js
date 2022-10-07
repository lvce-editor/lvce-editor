import * as Platform from '../Platform/Platform.js'
import * as IpcParent from '../IpcParent/IpcParent.js'

export const create = async () => {
  const extensionHostWorkerUrl = Platform.getExtensionHostWorkerUrl()
  return IpcParent.create({
    method: IpcParent.Methods.ModuleWorkerWithChromeDevtoolsBugWorkaround,
    url: extensionHostWorkerUrl,
    name: 'Extension Host',
  })
}
