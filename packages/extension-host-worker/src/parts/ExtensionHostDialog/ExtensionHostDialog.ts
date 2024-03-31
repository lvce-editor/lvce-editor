import * as Assert from '../Assert/Assert.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const showInformationMessage = (message) => {
  Assert.string(message)
  const result = Rpc.invoke('ExtensionHostDialog.showInformationMessage', message)
  return result
}
