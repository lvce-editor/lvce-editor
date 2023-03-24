export const getNumberOfVisibleItems = (state) => {
  const { height, itemHeight } = state
  const numberOfVisibleItemsTop = Math.floor(height / itemHeight)
  return numberOfVisibleItemsTop
}

export const getHiddenItems = (state) => {
  const numberOfVisibleItems = getNumberOfVisibleItems(state)
  const items = state.activityBarItems
  if (numberOfVisibleItems >= items.length) {
    return []
  }
  return state.activityBarItems.slice(numberOfVisibleItems - 2, -1)
}
