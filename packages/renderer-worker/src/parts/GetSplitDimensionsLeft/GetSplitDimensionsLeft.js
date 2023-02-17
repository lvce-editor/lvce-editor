import * as SashOrientation from '../SashOrientation/SashOrientation.js'

export const getSplitDimensionsLeft = (x, y, width, height, halfWidth, halfHeight, sashSize, sashVisibleSize, tabHeight) => {
  return {
    originalX: halfWidth,
    originalY: tabHeight,
    originalWidth: halfWidth,
    orignalHeight: height - tabHeight,
    originalTabsX: 0 + halfWidth,
    originalTabsY: 0,
    originalTabsWidth: halfWidth,
    originalTabsHeight: tabHeight,
    overlayX: 0,
    overlayY: tabHeight,
    overlayWidth: halfWidth - sashVisibleSize,
    overlayHeight: height - tabHeight,
    overlayTabsX: 0,
    overlayTabsY: 0,
    overlayTabsWidth: halfWidth,
    overlayTabsHeight: tabHeight,
    sashX: halfWidth,
    sashY: 0,
    sashWidth: sashSize,
    sashHeight: height,
    sashOrientation: SashOrientation.Vertical,
  }
}
