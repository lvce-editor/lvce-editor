import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const handleClickAction = async (state, index) => {
  Assert.object(state)
  Assert.number(index)
  const { actions, currentViewletId } = state
  const action = actions[index]
  Assert.object(action)
  const command = action.command
  Assert.string(command)
  const fullCommand = `${currentViewletId}.${command}`
  console.log({ fullCommand })
  await Command.execute(fullCommand)
  return state
}
