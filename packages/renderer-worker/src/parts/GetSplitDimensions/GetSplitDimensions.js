import * as EditorSplitDirectionType from '../EditorSplitDirectionType/EditorSplitDirectionType.js'
import * as GetSplitDimensionsDown from '../GetSplitDimensionsDown/GetSplitDimensionsDown.js'
import * as GetSplitDimensionsLeft from '../GetSplitDimensionsLeft/GetSplitDimensionsLeft.js'
import * as GetSplitDimensionsRight from '../GetSplitDimensionsRight/GetSplitDimensionsRight.js'
import * as GetSplitDimensionsUp from '../GetSplitDimensionsUp/GetSplitDimensionsUp.js'

export const getSplitDimensions = (x, y, width, height, splitDirection, sashSize, sashVisibleSize, tabHeight) => {
  const halfHeight = height / 2
  const halfWidth = width / 2
  switch (splitDirection) {
    case EditorSplitDirectionType.Up:
      return GetSplitDimensionsUp.getSplitDimensionsUp(x, y, width, height, halfWidth, halfHeight, sashSize, sashVisibleSize, tabHeight)
    case EditorSplitDirectionType.Down:
      return GetSplitDimensionsDown.getSplitDimensionsDown(x, y, width, height, halfWidth, halfHeight, sashSize, sashVisibleSize, tabHeight)
    case EditorSplitDirectionType.Left:
      return GetSplitDimensionsLeft.getSplitDimensionsLeft(x, y, width, height, halfWidth, halfHeight, sashSize, sashVisibleSize, tabHeight)
    case EditorSplitDirectionType.Right:
      return GetSplitDimensionsRight.getSplitDimensionsRight(x, y, width, height, halfWidth, halfHeight, sashSize, sashVisibleSize, tabHeight)
    case EditorSplitDirectionType.None:
      return {
        overlayX: x,
        overlayY: y,
        overlayWidth: width,
        overlayHeight: height,
      }
    default:
      return {
        overlayX: 0,
        overlayY: 0,
        overlayWidth: 0,
        overlayHeight: 0,
      }
  }
}
