import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as Platform from '../Platform/Platform.js'

export const create = async () => {
  const extensionHostWorkerUrl = Platform.getExtensionHostWorkerUrl()
  return IpcParent.create({
    method: IpcParentType.ReferencePort,
    url: extensionHostWorkerUrl,
    name: 'Extension Host',
  })
}
