export const getVisibleExplorerItems = (items, minLineY, maxLineY, focusedIndex) => {
  const visible = []
  for (let i = minLineY; i < Math.min(maxLineY, items.length); i++) {
    const item = items[i]
    visible.push({
      ...item,
      isFocused: i === focusedIndex,
    })
  }
  return visible
}
