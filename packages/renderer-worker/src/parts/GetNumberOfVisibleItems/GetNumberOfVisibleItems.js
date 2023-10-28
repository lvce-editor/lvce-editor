export const getNumberOfVisibleItems = (listHeight, itemHeight) => {
  return Math.ceil(listHeight / itemHeight)
}
