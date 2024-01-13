import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as Editor from '../Editor/Editor.js'
import * as Logger from '../Logger/Logger.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

export const applyDocumentEdits = (editor, edits) => {
  if (!Array.isArray(edits)) {
    Logger.warn('something is wrong with format on save', edits)
    return editor
  }
  if (edits.length === 0) {
    return editor
  }
  const { lines } = editor
  // TODO support multiple edits?
  const edit = edits[0]
  const start = TextDocument.positionAt(editor, edit.startOffset)
  const end = TextDocument.positionAt(editor, edit.endOffset)
  const documentEdits = [
    {
      start,
      end,
      inserted: SplitLines.splitLines(edit.inserted),
      deleted: lines,
      origin: EditOrigin.Format,
    },
  ]
  console.log({ documentEdits, edit })
  return Editor.scheduleDocumentAndCursorsSelections(editor, documentEdits)
}
