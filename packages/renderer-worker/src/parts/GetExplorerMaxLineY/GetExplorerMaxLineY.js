import * as GetNumberOfVisibleItems from '../GetNumberOfVisibleItems/GetNumberOfVisibleItems.js'

export const getExplorerMaxLineY = (minLineY, height, itemHeight, direntsLength) => {
  const maxLineY = minLineY + Math.min(GetNumberOfVisibleItems.getNumberOfVisibleItems(height, itemHeight), direntsLength)
  return maxLineY
}
