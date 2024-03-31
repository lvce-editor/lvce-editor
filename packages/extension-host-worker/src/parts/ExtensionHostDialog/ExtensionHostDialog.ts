import * as Assert from '../Assert/Assert.js'
import * as Rpc from '../Rpc/Rpc.js'

export const showInformationMessage = (message) => {
  Assert.string(message)
  const result = Rpc.invoke('ExtensionHostDialog.showInformationMessage', message)
  return result
}
