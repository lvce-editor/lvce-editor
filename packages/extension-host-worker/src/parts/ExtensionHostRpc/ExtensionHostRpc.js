import * as Assert from '../Assert/Assert.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as RpcParent from '../RpcParent/RpcParent.js'
import * as RpcParentType from '../RpcParentType/RpcParentType.js'
import { VError } from '../VError/VError.js'

const getExtensionHostHelperProcessUrl = () => {
  return new URL('../../../../extension-host-helper-process/src/extensionHostHelperProcessMain.js', import.meta.url).toString()
}

export const createRpc = async ({ url, name }) => {
  try {
    Assert.string(url)
    Assert.string(name)
    const helperProcessUrl = getExtensionHostHelperProcessUrl()
    console.log({ helperProcessUrl })
    const ipc = await IpcParent.create({
      method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
      url: helperProcessUrl,
      name,
    })
    const rpc = await RpcParent.create({
      ipc,
      method: RpcParentType.JsonRpc,
    })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create node rpc`)
  }
}
