import * as UtilityProcessState from '../UtilityProcessState/UtilityProcessState.js'
import * as FormatUtilityProcessName from '../FormatUtilityProcessName/FormatUtilityProcessName.js'
import * as Assert from '../Assert/Assert.js'

export const invokeAndTransfer = (name, message, transfer) => {
  Assert.string(name)
  Assert.object(message)
  // Assert.array(transfer)
  const formattedName = FormatUtilityProcessName.formatUtilityProcessName(name)
  const utilityProcess = UtilityProcessState.getByName(formattedName)
  if (!utilityProcess) {
    throw new Error(`utility process not found ${formattedName}`)
  }
  // TODO
  utilityProcess.postMessage(message, transfer)
}
