import * as CompletionItemFlags from '../CompletionItemFlags/CompletionItemFlags.js'
import * as EditorCompletionMap from '../EditorCompletionMap/EditorCompletionMap.js'
import * as GetCompletionItemHighlights from '../GetCompletionItemHighlights/GetCompletionItemHighlights.js'
import * as EditorCompletionType from '../EditorCompletionType/EditorCompletionType.js'
import * as IconTheme from '../IconTheme/IconTheme.js'

const getLabel = (item) => {
  return item.label
}

const getFileIcon = (item) => {
  if (item.kind !== EditorCompletionType.File) {
    return ''
  }
  return IconTheme.getFileNameIcon(item.label)
}

export const getVisibleIem = (item, itemHeight, leadingWord, i, focusedIndex) => {
  return {
    label: getLabel(item),
    symbolName: EditorCompletionMap.getSymbolName(item),
    top: i * itemHeight,
    highlights: GetCompletionItemHighlights.getHighlights(item, leadingWord),
    focused: i === focusedIndex,
    deprecated: item.flags & CompletionItemFlags.Deprecated,
    fileIcon: getFileIcon(item),
  }
}
