export const getSplitDimensionsDown = (x, y, width, height, halfWidth, halfHeight, sashSize, sashVisibleSize, tabHeight) => {
  return {
    originalX: 0,
    originalY: tabHeight,
    originalWidth: width,
    originalHeight: halfHeight - tabHeight,
    originalTabs: 0,
    originalTabsY: 0,
    originalTabsWidth: width,
    originalTabsHeight: tabHeight,
    overlayX: 0,
    overlayY: 0 + halfHeight,
    overlayWidth: width,
    overlayHeight: halfHeight,
    overlayTabsX: 0,
    overlayTabsY: 0 + halfHeight,
    overlayTabsWidth: width,
    overlayTabsHeight: tabHeight,
    sashX: 0,
    sashY: 0 + halfHeight,
    sashWidth: width,
    sashHeight: sashSize,
  }
}
