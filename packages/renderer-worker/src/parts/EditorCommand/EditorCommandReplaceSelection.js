import * as TextDocument from '../TextDocument/TextDocument.js'

export const editorReplaceSelections = (editor, replacement, origin) => {
  const changes = []
  for (const selection of editor.selections) {
    changes.push({
      start: selection.start,
      end: selection.end,
      inserted: replacement,
      deleted: TextDocument.getSelectionText(editor, selection),
      origin,
    })
  }
  return changes
}
