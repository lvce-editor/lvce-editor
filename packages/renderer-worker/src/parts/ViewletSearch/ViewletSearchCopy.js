import * as Command from '../Command/Command.js'

export const copy = async (state) => {
  const { items, listFocusedIndex } = state
  if (listFocusedIndex === -1) {
    return state
  }
  const item = items[listFocusedIndex]
  await Command.execute('ClipBoard.writeText', item.text)
  return state
}
