export const getVisible = (items, focusedIndex) => {
  const visibleItems = []
  const length = items.length
  for (let i = 0; i < length; i++) {
    const item = items[i]
    const { flags, label } = item
    visibleItems.push({
      label,
      flags,
      isFocused: i === focusedIndex,
    })
  }
  return visibleItems
}
