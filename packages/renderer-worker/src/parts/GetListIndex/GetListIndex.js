export const getListIndex = (eventX, eventY, x, y, deltaY, itemHeight) => {
  const relativeY = eventY - y + deltaY
  const index = Math.floor(relativeY / itemHeight)
  return index
}
