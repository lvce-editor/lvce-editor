import { focusIndex } from './ViewletExtensionsFocusIndex.js'
import * as Command from '../Command/Command.js'

export const handleClick = async (state, index) => {
  const { filteredExtensions, minLineY } = state
  const actualIndex = index + minLineY
  const extension = filteredExtensions[actualIndex]
  const uri = `extension-detail://${extension.id}`
  await Command.execute('Main.openUri', uri)
  return focusIndex(state, actualIndex)
}
