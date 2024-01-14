export const getVisibleExplorerItems = (items, minLineY, maxLineY, focusedIndex) => {
  const visible = []
  for (let i = minLineY; i < maxLineY; i++) {
    const item = items[i]
    visible.push({
      ...item,
      isFocused: i === focusedIndex,
    })
  }
  return visible
}
