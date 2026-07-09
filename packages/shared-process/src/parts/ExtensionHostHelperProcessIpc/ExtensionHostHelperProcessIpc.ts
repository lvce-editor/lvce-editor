import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import * as Id from '../Id/Id.ts'

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
