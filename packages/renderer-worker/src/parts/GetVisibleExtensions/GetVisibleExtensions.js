export const getVisible = (state) => {
  const { minLineY, maxLineY, items, itemHeight } = state
  const setSize = items.length
  const visible = []
  for (let i = minLineY; i < maxLineY; i++) {
    const item = items[i]
    visible.push({ ...item, setSize, posInSet: i + 1, top: i * itemHeight })
  }
  return visible
}
