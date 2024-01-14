export const getVisibleExplorerItems = (items, minLineY, maxLineY, focusedIndex, editingIndex) => {
  const visible = []
  for (let i = minLineY; i < Math.min(maxLineY, items.length); i++) {
    const item = items[i]
    if (i === editingIndex) {
      visible.push({
        ...item,
        isFocused: i === focusedIndex,
        isEditing: true,
      })
    } else {
      visible.push({
        ...item,
        isFocused: i === focusedIndex,
      })
    }
  }
  if (editingIndex === -1) {
    visible.push({
      depth: 3,
      posInSet: 1,
      setSize: 1,
      icon: '',
      isFocused: false,
      name: '',
      path: '',
      type: 2,
      isInput: true,
    })
  }
  console.log({ visible })
  return visible
}
