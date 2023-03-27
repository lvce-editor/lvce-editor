import * as EditorCompletionMap from '../EditorCompletionMap/EditorCompletionMap.js'

const getLabel = (item) => {
  return item.label
}

export const getVisibleItems = (filteredItems, minLineY, maxLineY) => {
  const visibleItems = []
  for (let i = minLineY; i < maxLineY; i++) {
    const filteredItem = filteredItems[i]
    visibleItems.push({
      label: getLabel(filteredItem),
      icon: EditorCompletionMap.getIcon(filteredItem),
      symbolName: EditorCompletionMap.getSymbolName(filteredItem),
    })
  }
  return visibleItems
}
