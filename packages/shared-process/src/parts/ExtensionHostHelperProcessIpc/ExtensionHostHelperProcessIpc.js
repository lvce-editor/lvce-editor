import * as IpcParent from '../IpcParent/IpcParent.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

export const create = async ({ method }) => {
  const extensionHostHelperProcessPath = await PlatformPaths.getExtensionHostHelperProcessPath()
  const ipc = await IpcParent.create({
    method,
    path: extensionHostHelperProcessPath,
    execArgv: ['--max-old-space-size=60', '--enable-source-maps'],
  })
  return ipc
}
