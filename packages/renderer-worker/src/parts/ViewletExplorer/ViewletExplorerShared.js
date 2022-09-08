export const getIndexFromPosition = (state, x, y) => {
  const { top, itemHeight, dirents } = state
  const index = Math.floor((y - top) / itemHeight)
  if (index < 0) {
    return 0
  }
  if (index > dirents.length) {
    return -1
  }
  return index
}
