import { focusIndex } from '../VirtualList/VirtualListFocusIndex.js'
import * as Command from '../Command/Command.js'

export const handleClick = async (state, index) => {
  const { items, minLineY } = state
  const actualIndex = index + minLineY
  const extension = items[actualIndex]
  const uri = `extension-detail://${extension.id}`
  await Command.execute('Main.openUri', uri)
  return focusIndex(state, actualIndex)
}
