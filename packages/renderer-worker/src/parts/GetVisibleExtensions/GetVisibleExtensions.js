const getVisibleItem = (item, setSize, itemHeight, minLineY, relative, i, focusedIndex) => {
  return {
    ...item,
    setSize,
    posInSet: i + 1,
    top: (i - minLineY) * itemHeight - relative,
    focused: i === focusedIndex,
  }
}

export const getVisible = (state) => {
  const { minLineY, maxLineY, items, itemHeight, deltaY, focusedIndex } = state
  const setSize = items.length
  const visible = []
  const relative = deltaY % itemHeight
  for (let i = minLineY; i < maxLineY; i++) {
    const item = items[i]
    visible.push(getVisibleItem(item, setSize, itemHeight, minLineY, relative, i, focusedIndex))
  }
  return visible
}
