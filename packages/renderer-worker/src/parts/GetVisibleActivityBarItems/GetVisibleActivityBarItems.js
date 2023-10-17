import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import { getNumberOfVisibleItems } from '../ViewletActivityBar/ViewletActivityBarGetHiddenItems.js'
import * as ViewletActivityBarStrings from '../ViewletActivityBar/ViewletActivityBarStrings.js'

const toVisibleItems = (items, selectedIndex, focusedIndex) => {
  const visibleItems = []
  for (let i = 0; i < items.length; i++) {
    const isSelected = i === selectedIndex
    const isFocused = i === focusedIndex
    const item = items[i]
    let flags = item.flags
    if (isSelected) {
      flags |= ActivityBarItemFlags.Selected
    }
    if (isFocused) {
      flags |= ActivityBarItemFlags.Focused
    }
    visibleItems.push({
      ...item,
      flags,
    })
  }
  return visibleItems
}

export const getVisibleActivityBarItems = (state) => {
  const numberOfVisibleItems = getNumberOfVisibleItems(state)
  const { activityBarItems, selectedIndex, focusedIndex } = state
  const items = activityBarItems
  if (numberOfVisibleItems >= items.length) {
    return toVisibleItems(items, selectedIndex, focusedIndex)
  }
  const showMoreItem = {
    id: 'Additional Views',
    title: ViewletActivityBarStrings.additionalViews(),
    icon: 'Ellipsis',
    enabled: true,
    flags: ActivityBarItemFlags.Button,
    keyShortCuts: '',
  }
  const visibleItems = toVisibleItems([...items.slice(0, numberOfVisibleItems - 2), showMoreItem, items.at(-1)], selectedIndex, focusedIndex)
  return visibleItems
}
