import * as Assert from '../Assert/Assert.js'
import * as EmptyMatches from '../EmptyMatches/EmptyMatches.js'
import * as FilterQuickPickItem from '../FilterQuickPickItem/FilterQuickPickItem.js'

const filterPicks = (state, picks, exclude, value, provider) => {
  const filteredItems = []
  for (const pick of picks) {
    const filterValue = provider.getPickLabel(pick)
    const result = FilterQuickPickItem.filterQuickPickItem(value, filterValue)
    if (result !== EmptyMatches.EmptyMatches) {
      filteredItems.push({
        pick,
        matches: result,
      })
    }
  }
  return filteredItems
}

export const getFilteredItems = (state, picks, recentPickIds, filterValue, provider) => {
  Assert.object(state)
  Assert.array(picks)
  Assert.string(filterValue)
  const items = filterPicks(state, picks, recentPickIds, filterValue, provider)
  return items
  // TODO avoid mutation
  // state.items = items
  // const slicedPicks = slicePicks(items)
  // return toDisplayPicks(slicedPicks)
}
