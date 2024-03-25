import { MessageChannelMain } from 'electron'
import * as Assert from '../Assert/Assert.js'
import * as Callback from '../Callback/Callback.js'
import * as FormatUtilityProcessName from '../FormatUtilityProcessName/FormatUtilityProcessName.js'
import * as IpcParentWithElectronUtilityProcess from '../IpcParentWithElectronUtilityProcess/IpcParentWithElectronUtilityProcess.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'
import * as UtilityProcessState from '../UtilityProcessState/UtilityProcessState.js'

// TODO
// In order to create utility process from shared process
// create a message channel in the main process and
// send one port to the shared process and the other port
// to the utilityprocess that should be created.
// Then send the other message port that has been sent from renderer worker
// to renderer process to shared process onto the message port
// that was created in the main process to the new utility process
// The message ports in main process only exist temporarily
// because they are sent to the shared process/utility process
export const create = async (name) => {
  Assert.string(name)
  const formattedName = FormatUtilityProcessName.formatUtilityProcessName(name)
  const utilityProcess = UtilityProcessState.getByName(formattedName)
  const { port1, port2 } = new MessageChannelMain()
  await JsonRpc.invokeAndTransfer(SharedProcessState.state.sharedProcess, [port1], 'TemporaryMessagePort.handlePort', name)
  // @ts-ignore
  const utilityProcessIpc = IpcParentWithElectronUtilityProcess.wrap(utilityProcess)
  const handleUtilityProcessMessage = (message) => {
    Callback.resolve(message.id, message)
    utilityProcess.off('message', handleUtilityProcessMessage)
  }
  utilityProcess.on('message', handleUtilityProcessMessage)
  await JsonRpc.invokeAndTransfer(utilityProcessIpc, [port2], 'HandleElectronMessagePort.handleElectronMessagePort')
}

export const dispose = (name) => {
  Assert.string(name)
  const formattedName = FormatUtilityProcessName.formatUtilityProcessName(name)
  const utilityProcess = UtilityProcessState.getByName(formattedName)
  if (!utilityProcess) {
    return
  }
  utilityProcess.kill()
}
