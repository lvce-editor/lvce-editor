// TODO improve and test function
export const getZoomLevelToPercentValue = (zoomLevel) => {
  if (zoomLevel === 0) {
    return 1
  }
  if (zoomLevel === -0.2) {
    return 0.96
  }
  if (zoomLevel === 0.2) {
    return 1.04
  }
  return 1
}
