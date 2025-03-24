export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return state
  // // TODO should just return new state, render function can take old state and new state and return render commands
  // const listHeight = getListHeight({ ...state, ...dimensions })
  // const maxLineY = Math.min(minLineY + GetNumberOfVisibleItems.getNumberOfVisibleItems(listHeight, itemHeight), items.length)
  // const size = GetViewletSize.getViewletSize(dimensions.width)
  // return {
  //   ...state,
  //   ...dimensions,
  //   maxLineY,
  //   size,
  // }
}
