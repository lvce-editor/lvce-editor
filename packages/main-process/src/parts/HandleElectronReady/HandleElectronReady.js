import { JsonRpcEvent } from '../JsonRpc/JsonRpc.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const handleReady = async (parsedArgs, workingDirectory) => {
  // TODO move preferences loading and window creation to shared process
  const method = IpcParentType.ElectronUtilityProcess
  const sharedProcess = await SharedProcess.hydrate({
    method,
  })
  const message = JsonRpcEvent.create('HandleElectronReady.handleElectronReady', [parsedArgs, workingDirectory])
  sharedProcess.send(message)
}
