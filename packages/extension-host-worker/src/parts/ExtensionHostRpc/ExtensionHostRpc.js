import * as Assert from '../Assert/Assert.js'
import * as GetExtensionHostSubWorkerUrl from '../GetExtensionHostSubWorkerUrl/GetExtensionHostSubWorkerUrl.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as RpcParent from '../RpcParent/RpcParent.js'
import * as RpcParentType from '../RpcParentType/RpcParentType.js'
import { VError } from '../VError/VError.js'

export const createRpc = async ({ url, name }) => {
  try {
    Assert.string(url)
    Assert.string(name)
    const helperProcessUrl = GetExtensionHostSubWorkerUrl.getExtensionHostSubWorkerUrl()
    const ipc = await IpcParent.create({
      method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
      url: helperProcessUrl,
      name,
    })
    const rpc = await RpcParent.create({
      ipc,
      method: RpcParentType.JsonRpc,
    })
    await rpc.invoke('setUrl', url)
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create rpc`)
  }
}
