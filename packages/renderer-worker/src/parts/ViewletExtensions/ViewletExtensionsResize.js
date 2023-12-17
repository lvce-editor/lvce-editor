import * as GetViewletSize from '../GetViewletSize/GetViewletSize.js'
import * as GetNumberOfVisibleItems from '../GetNumberOfVisibleItems/GetNumberOfVisibleItems.js'
import { getListHeight } from './ViewletExtensionsShared.js'

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  const { itemHeight, minLineY, items } = state
  // TODO should just return new state, render function can take old state and new state and return render commands
  const listHeight = getListHeight({ ...state, ...dimensions })
  const maxLineY = Math.min(minLineY + GetNumberOfVisibleItems.getNumberOfVisibleItems(listHeight, itemHeight), items.length)
  const size = GetViewletSize.getViewletSize(dimensions.width)
  return {
    ...state,
    ...dimensions,
    maxLineY,
    size,
  }
}
