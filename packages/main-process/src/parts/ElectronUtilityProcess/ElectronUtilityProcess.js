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
  console.log({ message, transfer })
  utilityProcess.postMessage(message, transfer)
  // console.log({ x, name, formattedName })
  // console.log(UtilityProcessState.state.all)
}
