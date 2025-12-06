import * as IpcParent from '../IpcParent/IpcParent.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as Id from '../Id/Id.js'

export const create = async ({ method }) => {
  const extensionHostHelperProcessPath = await PlatformPaths.getExtensionHostHelperProcessPath()
  const id = Id.create()
  const ipc = await IpcParent.create({
    method,
    path: extensionHostHelperProcessPath,
    execArgv: [],
    name: `Extension Host Helper Process ${id}`,
  })
  return ipc
}
