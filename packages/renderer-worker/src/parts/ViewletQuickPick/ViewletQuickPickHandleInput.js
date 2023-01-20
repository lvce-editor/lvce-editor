import * as FilterQuickPickItems from '../FilterQuickPickItems/FilterQuickPickItems.js'

// TODO when user types letters -> no need to query provider again -> just filter existing results
export const handleInput = async (state, newValue, cursorOffset) => {
  if (state.value === newValue) {
    return state
  }
  const newPicks = await state.provider.getPicks(newValue)
  const filterValue = state.provider.getFilterValue(newValue)
  const items = FilterQuickPickItems.getFilteredItems(state, newPicks, filterValue)
  const focusedIndex = items.length === 0 ? -1 : 0
  return {
    ...state,
    value: newValue,
    picks: newPicks,
    items,
    focusedIndex,
    cursorOffset,
  }
}
