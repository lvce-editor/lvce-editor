import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostSubWorkerUrl from '../ExtensionHostSubWorkerUrl/ExtensionHostSubWorkerUrl.ts'
import * as ExtensionHostWorkerContentSecurityPolicy from '../ExtensionHostWorkerContentSecurityPolicy/ExtensionHostWorkerContentSecurityPolicy.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as RpcParent from '../RpcParent/RpcParent.ts'
import * as RpcParentType from '../RpcParentType/RpcParentType.ts'
import { VError } from '../VError/VError.ts'

const defaultExecute = () => {
  throw new Error('not implemented')
}

export const createRpc = async ({ url, name, execute = defaultExecute, contentSecurityPolicy }) => {
  try {
    Assert.string(url)
    Assert.string(name)
    Assert.fn(execute)
    if (contentSecurityPolicy) {
      await ExtensionHostWorkerContentSecurityPolicy.set(url, contentSecurityPolicy)
    }
    const ipc = await IpcParent.create({
      method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
      url: ExtensionHostSubWorkerUrl.extensionHostSubWorkerUrl,
      name,
    })
    const rpc = await RpcParent.create({
      ipc,
      method: RpcParentType.tsonRpc,
      execute,
    })
    await rpc.invoke('LoadFile.loadFile', url)
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create webworker rpc`)
  }
}
