import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorDelta from '../EditorCommand/EditorCommandDelta.js'

export const getEditorDeltaFunction = (editorDeltaId) => {
  switch (editorDeltaId) {
    case EditorDeltaId.CharacterLeft:
      return EditorDelta.characterLeft
    case EditorDeltaId.CharacterRight:
      return EditorDelta.characterRight
    case EditorDeltaId.Line:
      return EditorDelta.line
    case EditorDeltaId.LineCharacterStart:
      return EditorDelta.lineCharacterStart
    case EditorDeltaId.LineEnd:
      return EditorDelta.lineEnd
    case EditorDeltaId.TwoCharactersLeft:
      return EditorDelta.twoCharactersLeft
    case EditorDeltaId.WordLeft:
      return EditorDelta.wordLeft
    case EditorDeltaId.WordPartLeft:
      return EditorDelta.wordPartLeft
    case EditorDeltaId.WordPartRight:
      return EditorDelta.wordPartRight
    case EditorDeltaId.WordRight:
      return EditorDelta.wordRight
    default:
      throw new Error('editor delta function not found')
  }
}
