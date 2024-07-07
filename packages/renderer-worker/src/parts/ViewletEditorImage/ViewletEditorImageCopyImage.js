import * as ClipBoard from '../ClipBoard/ClipBoard.js'
import * as Command from '../Command/Command.js'

export const copyImage = async (state) => {
  const blob = await Command.execute('Ajax.getBlob', state.src)
  await ClipBoard.writeImage(blob)
  return state
}
