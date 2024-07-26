import * as Command from '../Command/Command.js'
import * as RendererWorkerCommandType from '../RendererWorkerCommandType/RendererWorkerCommandType.js'

export const copy = async (state) => {
  const { items, listFocusedIndex } = state
  if (listFocusedIndex === -1) {
    return state
  }
  const item = items[listFocusedIndex]
  await Command.execute(RendererWorkerCommandType.ClipBoardWriteText, item.text)
  return state
}
