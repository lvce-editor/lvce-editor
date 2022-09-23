import * as Command from '../Command/Command.js'

export const copyPath = async (state) => {
  await Command.execute('ClipBoard.writeText', state.uri)
  return state
}
