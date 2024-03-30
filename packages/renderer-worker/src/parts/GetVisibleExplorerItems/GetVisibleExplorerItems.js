import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.js'
import * as IconTheme from '../IconTheme/IconTheme.js'

export const getVisibleExplorerItems = (items, minLineY, maxLineY, focusedIndex, editingIndex, editingType, editingValue) => {
  const visible = []
  for (let i = minLineY; i < Math.min(maxLineY, items.length); i++) {
    const item = items[i]
    if (i === editingIndex) {
      visible.push({
        ...item,
        isFocused: i === focusedIndex,
        isEditing: true,
        icon: IconTheme.getFileIcon({
          name: editingValue,
        }),
      })
    } else {
      visible.push({
        ...item,
        isFocused: i === focusedIndex,
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
