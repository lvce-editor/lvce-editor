import * as EditorCompletionMap from '../EditorCompletionMap/EditorCompletionMap.js'

const getLabel = (item) => {
  return item.label
}

const getHighlights = (item, leadingWord) => {
  const label = item.label
  const matches = item.matches
  return matches.slice(1)
}

const getVisibleIem = (item, itemHeight, leadingWord, i, focusedIndex) => {
  return {
    label: getLabel(item),
    symbolName: EditorCompletionMap.getSymbolName(item),
    top: i * itemHeight,
    highlights: getHighlights(item, leadingWord),
    focused: i === focusedIndex,
  }
}

export const getVisibleItems = (filteredItems, itemHeight, leadingWord, minLineY, maxLineY, focusedIndex) => {
  const visibleItems = []
  for (let i = minLineY; i < maxLineY; i++) {
    const filteredItem = filteredItems[i]
    visibleItems.push(getVisibleIem(filteredItem, itemHeight, leadingWord, i, focusedIndex))
  }
  return visibleItems
}
