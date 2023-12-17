import * as InputSource from '../InputSource/InputSource.js'
import * as ViewletQuickPickGetFilteredItems from './ViewletQuickPickGetFilteredItems.js'

// TODO when user types letters -> no need to query provider again -> just filter existing results
export const handleInput = async (state, newValue, cursorOffset, inputSource = InputSource.Script) => {
  if (state.value === newValue) {
    return state
  }
  state.value = newValue
  state.inputSource = inputSource
  const newPicks = await state.provider.getPicks(newValue)
  const filterValue = state.provider.getFilterValue(newValue)
  const items = ViewletQuickPickGetFilteredItems.getFilteredItems(state, newPicks, filterValue, state.provider)
  const focusedIndex = items.length === 0 ? -1 : 0
  return {
    ...state,
    picks: newPicks,
    items,
    focusedIndex,
    cursorOffset,
  }
}
