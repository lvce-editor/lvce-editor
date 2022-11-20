import * as IpcParent from '../IpcParent/IpcParent.js'
import * as Platform from '../Platform/Platform.js'

export const listen = (method) => {
  return IpcParent.create({
    method,
    type: 'extension-host',
    name: 'Extension Host',
    url: Platform.getExtensionHostWorkerUrl(),
  })
}
