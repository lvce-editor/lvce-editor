export const getSplitDimensionsUp = (x, y, width, height, halfWidth, halfHeight, sashSize, sashVisibleSize, tabHeight) => {
  return {
    originalX: 0,
    originalY: halfHeight,
    originalWidth: width,
    originalHeight: halfHeight - tabHeight,
    originalTabsX: 0,
    originalTabsY: 0 + halfHeight,
    originalTabsWidth: width,
    originalTabsHeight: tabHeight,
    overlayX: 0,
    overlayY: tabHeight,
    overlayWidth: width,
    overlayHeight: halfHeight - tabHeight,
    overlayTabsX: 0,
    overlayTabsY: 0,
    overlayTabsWidth: width,
    overlayTabsHeight: tabHeight,
    sashX: 0,
    sashY: 0 + halfHeight,
    sashWidth: width,
    sashHeight: sashSize,
  }
}
