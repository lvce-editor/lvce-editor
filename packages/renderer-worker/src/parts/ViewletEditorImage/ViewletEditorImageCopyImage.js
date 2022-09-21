import * as Command from '../Command/Command.js'

export const copyImage = async (state) => {
  const blob = await Command.execute('Ajax.getBlob', state.src)
  await Command.execute('ClipBoard.writeImage', blob)
  return state
}
