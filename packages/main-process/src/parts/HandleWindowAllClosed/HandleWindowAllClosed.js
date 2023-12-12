import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const handleWindowAllClosed = async () => {
  const method = IpcParentType.ElectronUtilityProcess
  const sharedProcess = await SharedProcess.hydrate({
    method,
    env: {},
  })
  JsonRpc.send(sharedProcess, 'HandleWindowAllClosed.handleWindowAllClosed')
}
