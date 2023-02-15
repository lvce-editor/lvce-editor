export const getSplitDimensionsLeft = (x, y, width, height, halfWidth, halfHeight, sashSize, sashVisibleSize, tabHeight) => {
  return {
    originalX: halfWidth,
    originalY: 0,
    originalWidth: halfWidth,
    orignalHeight: height,
    originalTabsX: 0 + halfWidth,
    originalTabsY: 0,
    originalTabsWidth: halfWidth,
    originalTabsHeight: tabHeight,
    overlayX: 0,
    overlayY: 0,
    overlayWidth: halfWidth - sashVisibleSize,
    overlayHeight: height,
    overlayTabsX: 0,
    overlayTabsY: 0,
    overlayTabsWidth: halfWidth,
    overlayTabsHeight: tabHeight,
    sashX: halfWidth,
    sashY: 0,
    sashWidth: sashVisibleSize,
    sashHeight: height,
  }
}
