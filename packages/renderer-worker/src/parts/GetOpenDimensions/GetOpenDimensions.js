export const getOpenDimensions = (x, y, width, height, tabHeight) => {
  return {
    originalX: 0,
    originalY: tabHeight,
    originalWidth: width,
    originalHeight: height - tabHeight,
    tabsX: 0,
    tabsY: 0,
    tabsWidth: width,
    tabsHeight: tabHeight,
  }
}
