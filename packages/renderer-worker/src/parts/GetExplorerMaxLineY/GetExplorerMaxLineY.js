export const getExplorerMaxLineY = (minLineY, height, itemHeight, direntsLength) => {
  const maxLineY = minLineY + Math.min(Math.ceil(height / itemHeight), direntsLength)
  return maxLineY
}
