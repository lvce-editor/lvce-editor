import * as Id from '../Id/Id.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'

export const create = async ({ method }: any): Promise<any> => {
  const extensionHostHelperProcessPath = await PlatformPaths.getExtensionHostHelperProcessPath()
  const id = Id.create()
  const ipc = await IpcParent.create({
    execArgv: [],
    method,
    name: `Extension Host Helper Process ${id}`,
    path: extensionHostHelperProcessPath,
  })
  return ipc
}
