import * as EditorSplitDirectionType from '../EditorSplitDirectionType/EditorSplitDirectionType.js'

export const getSplitOverlayDimensions = (x, y, width, height, splitDirection) => {
  const halfHeight = height / 2
  const halfWidth = width / 2
  switch (splitDirection) {
    case EditorSplitDirectionType.Up:
      return {
        overlayX: x,
        overlayY: y,
        overlayWidth: width,
        overlayHeight: halfHeight,
      }
    case EditorSplitDirectionType.Down:
      return {
        overlayX: x,
        overlayY: y + halfHeight,
        overlayWidth: width,
        overlayHeight: halfHeight,
      }
    case EditorSplitDirectionType.Left:
      return {
        overlayX: x,
        overlayY: y,
        overlayWidth: halfWidth,
        overlayHeight: height,
      }
    case EditorSplitDirectionType.Right:
      return {
        overlayX: x + halfWidth,
        overlayY: y,
        overlayWidth: halfWidth,
        overlayHeight: height,
      }
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
