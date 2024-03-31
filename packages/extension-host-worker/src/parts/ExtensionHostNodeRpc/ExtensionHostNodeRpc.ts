import * as Assert from '../Assert/Assert.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as RpcParent from '../RpcParent/RpcParent.ts'
import * as RpcParentType from '../RpcParentType/RpcParentType.ts'
import { VError } from '../VError/VError.ts'

const defaultExecute = () => {
  throw new Error('not implemented')
}

export const createNodeRpc = async ({ path, execute = defaultExecute, name = '' }) => {
  try {
    Assert.string(path)
    Assert.fn(execute)
    const ipc = await IpcParent.create({
      method: IpcParentType.ElectronMessagePort,
      type: 'extension-host-helper-process',
      name,
    })
    const rpc = await RpcParent.create({
      ipc,
      method: RpcParentType.tsonRpc,
      execute,
    })
    await rpc.invoke('LoadFile.loadFile', path)
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create node rpc`)
  }
}
