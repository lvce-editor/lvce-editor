import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.js'

// TODO rename this to displayResults
// - items = normal dirents
// - visible items = normal dirents that are visible
// - display results = displayed elements (almost dom nodes)
export const getVisibleExplorerItems = (items, minLineY, maxLineY, focusedIndex, editingIndex, editingType, editingValue, icons) => {
  const visible = []
  let iconIndex = 0
  for (let i = minLineY; i < Math.min(maxLineY, items.length); i++) {
    const item = items[i]
    const icon = icons[iconIndex++]
    if (i === editingIndex) {
      visible.push({
        ...item,
        isFocused: i === focusedIndex,
        isEditing: true,
        icon,
      })
    } else {
      visible.push({
        ...item,
        isFocused: i === focusedIndex,
        icon,
      })
    }
  }
  if (editingType !== ExplorerEditingType.None && editingIndex === -1) {
    visible.push({
      depth: 3,
      posInSet: 1,
      setSize: 1,
      icon: '',
      isFocused: false,
      name: 'new',
      path: '/test/new',
      type: 2,
      isEditing: true,
    })
  }
  return visible
}
