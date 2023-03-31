import * as Bracket from '../Bracket/Bracket.js'
import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

const getMatchingClosingBrace = (brace) => {
  switch (brace) {
    case Bracket.CurlyOpen:
      return Bracket.CurlyClose
    case Bracket.RoundOpen:
      return Bracket.RoundClose
    case Bracket.SquareOpen:
      return Bracket.SquareClose
    default:
      return Bracket.Unknown
  }
}

export const typeWithAutoClosingBracket = (editor, text) => {
  const closingBracket = getMatchingClosingBrace(text)
  const newText = text + closingBracket
  const changes = editorReplaceSelections(editor, [newText], EditOrigin.EditorTypeWithAutoClosing)
  const selectionChanges = new Uint32Array([
    changes[0].start.rowIndex,
    changes[0].start.columnIndex + 1,
    changes[0].end.rowIndex,
    changes[0].end.columnIndex + 1,
  ])
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
