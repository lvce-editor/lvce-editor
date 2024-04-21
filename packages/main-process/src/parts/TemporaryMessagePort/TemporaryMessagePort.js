import * as Assert from '../Assert/Assert.js'
import * as FormatUtilityProcessName from '../FormatUtilityProcessName/FormatUtilityProcessName.js'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParentWithElectronUtilityProcess from '../IpcParentWithElectronUtilityProcess/IpcParentWithElectronUtilityProcess.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
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

export const createPortTuple = async (id1, id2) => {
  Assert.number(id1)
  Assert.number(id2)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  // TODO use one call to send both
  await SharedProcess.invokeAndTransfer([port1], 'TemporaryMessagePort.handlePort', id1)
  await SharedProcess.invokeAndTransfer([port2], 'TemporaryMessagePort.handlePort', id2)
}

export const sendTo = async (port, name) => {
  Assert.string(name)
  Assert.object(port)
  const formattedName = FormatUtilityProcessName.formatUtilityProcessName(name)
  const utilityProcess = UtilityProcessState.getByName(formattedName)
  // @ts-ignore
  const utilityProcessIpc = IpcParentWithElectronUtilityProcess.wrap(utilityProcess)
  HandleIpc.handleIpc(utilityProcessIpc)
  await JsonRpc.invokeAndTransfer(utilityProcessIpc, [port], 'HandleElectronMessagePort.handleElectronMessagePort')
  HandleIpc.unhandleIpc(utilityProcessIpc)
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
