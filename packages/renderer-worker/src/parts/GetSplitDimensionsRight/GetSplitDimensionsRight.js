export const getSplitDimensionsRight = (x, y, width, height, halfWidth, halfHeight, sashSize, sashVisibleSize, tabHeight) => {
  return {
    originalX: 0,
    originalY: tabHeight,
    originalWidth: halfWidth,
    originalHeight: height - tabHeight,
    originalTabsX: 0,
    originalTabsY: 0,
    originalTabsWidth: halfWidth,
    originalTabsHeight: tabHeight,
    overlayX: 0 + halfWidth + sashVisibleSize,
    overlayY: 0 + tabHeight,
    overlayWidth: halfWidth - sashVisibleSize,
    overlayHeight: height - tabHeight,
    overlayTabsX: 0 + halfWidth,
    overlayTabsY: 0,
    overlayTabsWidth: halfWidth,
    overlayTabsHeight: tabHeight,
    sashX: 0 + halfWidth,
    sashY: 0,
    sashWidth: sashSize,
    sashHeight: height,
  }
}
