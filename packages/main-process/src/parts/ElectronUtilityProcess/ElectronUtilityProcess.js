import * as UtilityProcessState from '../UtilityProcessState/UtilityProcessState.js'
import * as FormatUtilityProcessName from '../FormatUtilityProcessName/FormatUtilityProcessName.js'

export const invokeAndTransfer = (name, message, transfer) => {
  const formattedName = FormatUtilityProcessName.formatUtilityProcessName(name)
  const x = UtilityProcessState.getByName(formattedName)
  console.log({ x, name, formattedName })
  console.log(UtilityProcessState.state.all)
}
