import * as CompletionItemFlags from '../CompletionItemFlags/CompletionItemFlags.js'
import * as EditorCompletionMap from '../EditorCompletionMap/EditorCompletionMap.js'
import * as GetCompletionItemHighlights from '../GetCompletionItemHighlights/GetCompletionItemHighlights.js'

const getLabel = (item) => {
  return item.label
}

const getVisibleIem = (item, itemHeight, leadingWord, i, focusedIndex) => {
  return {
    label: getLabel(item),
    symbolName: EditorCompletionMap.getSymbolName(item),
    top: i * itemHeight,
    highlights: GetCompletionItemHighlights.getHighlights(item, leadingWord),
    focused: i === focusedIndex,
    deprecated: item.flags & CompletionItemFlags.Deprecated,
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
