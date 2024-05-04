import * as CompletionItemFlags from '../CompletionItemFlags/CompletionItemFlags.js'
import * as EditorCompletionMap from '../EditorCompletionMap/EditorCompletionMap.js'
import * as GetCompletionItemHighlights from '../GetCompletionItemHighlights/GetCompletionItemHighlights.js'
import * as EditorCompletionType from '../EditorCompletionType/EditorCompletionType.js'
import * as IconTheme from '../IconTheme/IconTheme.js'

const getLabel = (item) => {
  return item.label
}

const getFileIcon = (item) => {
  switch (item.kind) {
    case EditorCompletionType.File:
      return IconTheme.getFileNameIcon(item.label)
    case EditorCompletionType.Folder:
      return IconTheme.getFolderNameIcon(item.label)
    default:
      return ''
  }
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
