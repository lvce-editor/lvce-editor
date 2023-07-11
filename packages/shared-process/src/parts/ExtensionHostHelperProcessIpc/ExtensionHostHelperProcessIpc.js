import * as IpcParent from '../IpcParent/IpcParent.js'
import * as Platform from '../Platform/Platform.js'

export const create = async ({ method }) => {
  const extensionHostHelperProcessPath = await Platform.getExtensionHostHelperProcessPath()
  const ipc = await IpcParent.create({
    method,
    path: extensionHostHelperProcessPath,
    execArgv: ['--max-old-space-size=60', '--enable-source-maps'],
  })
  return ipc
}
