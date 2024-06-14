import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'

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
  const { filteredItems, selectedIndex, focusedIndex } = state
  return toVisibleItems(filteredItems, selectedIndex, focusedIndex)
}
