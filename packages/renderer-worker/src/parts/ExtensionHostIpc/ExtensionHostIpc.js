import * as IpcParent from '../IpcParent/IpcParent.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const getName = () => {
  if (Platform.getPlatform() === PlatformType.Electron) {
    return 'Extension Host (Electron)'
  }
  return 'Extension Host'
}

export const listen = (method) => {
  return IpcParent.create({
    method,
    type: 'extension-host',
    name: getName(),
    url: PlatformPaths.getExtensionHostWorkerUrl(),
  })
}
