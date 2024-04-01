import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'

export const handleClickAction = async (state, index, command) => {
  Assert.object(state)
  Assert.number(index)
  const { currentViewletId } = state
  Assert.string(command)
  if (command === 'undefined') {
    throw new Error(`command is undefined`)
  }
  const fullCommand = `${currentViewletId}.${command}`
  await Command.execute(fullCommand)
  return state
}
