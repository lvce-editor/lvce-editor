import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'

export const showInformationMessage = async (message) => {
  Assert.string(message)
  const result = await Command.execute('ConfirmPrompt.prompt', message)
  return result
}
