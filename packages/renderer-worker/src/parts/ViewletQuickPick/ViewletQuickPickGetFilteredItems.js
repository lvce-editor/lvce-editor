import * as Assert from '../Assert/Assert.js'
import * as FilterQuickPickItems from '../FilterQuickPickItems/FilterQuickPickItems.js'

export const getFilteredItems = (state, picks, filterValue, provider) => {
  Assert.object(state)
  Assert.array(picks)
  Assert.string(filterValue)
  const items = FilterQuickPickItems.getFilteredItems(state, picks, state.recentPickIds, filterValue, provider)
  return items
  // TODO avoid mutation
  // state.items = items
  // const slicedPicks = slicePicks(items)
  // return toDisplayPicks(slicedPicks)
}
