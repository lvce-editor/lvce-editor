// @ts-ignore
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
import * as Logger from '../Logger/Logger.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.ts'

const getDocumentEdits = (editor: any, edits: any[]) => {
  const documentEdits = []
  for (const edit of edits) {
    const start = TextDocument.positionAt(editor, edit.startOffset)
    const end = TextDocument.positionAt(editor, edit.endOffset)
    const deleted = TextDocument.getSelectionText(editor, {
      start,
      end,
    })
    const documentEdit = {
      start,
      end,
      inserted: SplitLines.splitLines(edit.inserted),
      deleted,
      origin: EditOrigin.Format,
    }
    if (documentEdit.inserted.length === 0) {
      documentEdit.inserted = ['']
    }
    documentEdits.push(documentEdit)
  }
  return documentEdits
}

// @ts-ignore
export const applyDocumentEdits = (editor, edits) => {
  if (!Array.isArray(edits)) {
    Logger.warn('something is wrong with format on save', edits)
    return editor
  }
  if (edits.length === 0) {
    return editor
  }
  const documentEdits = getDocumentEdits(editor, edits)
  console.log({ edits, documentEdits })
  return Editor.scheduleDocumentAndCursorsSelections(editor, documentEdits)
}
