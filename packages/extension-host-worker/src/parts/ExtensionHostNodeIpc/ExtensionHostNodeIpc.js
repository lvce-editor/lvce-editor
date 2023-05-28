import * as Assert from '../Assert/Assert.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as RpcParent from '../RpcParent/RpcParent.js'
import * as RpcParentType from '../RpcParentType/RpcParentType.js'
import { VError } from '../VError/VError.js'

const defaultExecute = () => {
  throw new Error('not implemented')
}

export const createNodeRpc = async ({ path, execute = defaultExecute }) => {
  try {
    Assert.string(path)
    Assert.fn(execute)
    const ipc = await IpcParent.create({
      method: IpcParentType.ElectronMessagePort,
      type: `custom:${path}`,
    })
    const rpc = await RpcParent.create({
      ipc,
      method: RpcParentType.JsonRpc,
      execute,
    })
    await rpc.invoke('LoadFile.loadFile', path)
    console.log({ path })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create node rpc`)
  }
}
