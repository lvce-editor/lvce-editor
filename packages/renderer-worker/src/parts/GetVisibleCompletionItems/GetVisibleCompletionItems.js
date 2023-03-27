import * as EditorCompletionMap from '../EditorCompletionMap/EditorCompletionMap.js'

const getLabel = (item) => {
  return item.label
}

const getVisibleIem = (item, itemHeight, i) => {
  return {
    label: getLabel(item),
    icon: EditorCompletionMap.getIcon(item),
    symbolName: EditorCompletionMap.getSymbolName(item),
    top: i * itemHeight,
  }
}

export const getVisibleItems = (filteredItems, itemHeight, minLineY, maxLineY) => {
  const visibleItems = []
  for (let i = minLineY; i < maxLineY; i++) {
    const filteredItem = filteredItems[i]
    visibleItems.push(getVisibleIem(filteredItem, itemHeight, i))
  }
  return visibleItems
}
