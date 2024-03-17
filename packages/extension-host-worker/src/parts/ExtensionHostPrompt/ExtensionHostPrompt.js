import * as Assert from '../Assert/Assert.js'
import * as Rpc from '../Rpc/Rpc.js'

export const confirm = (message) => {
  Assert.string(message)
  const result = Rpc.invoke('ConfirmPrompt.prompt', message)
  return result
}
