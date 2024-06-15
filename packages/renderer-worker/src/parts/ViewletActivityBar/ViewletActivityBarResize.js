import * as GetFilteredActivityBarItems from '../GetFilteredActivityBarItems/GetFilteredActivityBarItems.js'

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  const filteredItems = GetFilteredActivityBarItems.getFilteredActivityBarItems(state.activityBarItems, dimensions.height, state.itemHeight)
  return {
    ...state,
    filteredItems,
    ...dimensions,
  }
}
