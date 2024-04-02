import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'

const getId = (state) => {
  const { currentViewletId } = state
  return currentViewletId
}

export const handleClickAction = async (state, index, command) => {
  Assert.object(state)
  Assert.number(index)
  Assert.string(command)
  if (command === 'undefined') {
    throw new Error(`command is undefined`)
  }
  const currentViewletId = getId(state)
  const fullCommand = `${currentViewletId}.${command}`
  await Command.execute(fullCommand)
  return state
}
