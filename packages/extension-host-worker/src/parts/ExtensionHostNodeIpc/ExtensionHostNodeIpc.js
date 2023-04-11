import * as Assert from '../Assert/Assert.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as RpcParent from '../RpcParent/RpcParent.js'
import * as RpcParentType from '../RpcParentType/RpcParentType.js'
import { VError } from '../VError/VError.js'

export const createNodeRpc = async ({ path }) => {
  try {
    Assert.string(path)
    const ipc = await IpcParent.create({
      method: IpcParentType.ElectronMessagePort,
      type: `custom:${path}`,
    })
    const rpc = await RpcParent.create({
      ipc,
      method: RpcParentType.JsonRpc,
    })
    await rpc.invoke('LoadFile.loadFile', path)
    console.log({ path })

    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create node rpc`)
  }
}
