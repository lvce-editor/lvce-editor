import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostSubWorkerUrl from '../ExtensionHostSubWorkerUrl/ExtensionHostSubWorkerUrl.js'
import * as ExtensionHostWorkerContentSecurityPolicy from '../ExtensionHostWorkerContentSecurityPolicy/ExtensionHostWorkerContentSecurityPolicy.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as RpcParent from '../RpcParent/RpcParent.js'
import * as RpcParentType from '../RpcParentType/RpcParentType.js'
import { VError } from '../VError/VError.js'

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
      method: RpcParentType.JsonRpc,
      execute,
    })
    await rpc.invoke('LoadFile.loadFile', url)
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create webworker rpc`)
  }
}
