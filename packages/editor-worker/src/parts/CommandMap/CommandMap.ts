import * as DeleteCharacterLeft from '../EditorCommand/EditorCommandDeleteCharacterLeft.js'
import * as DeleteHorizontalRight from '../EditorCommand/EditorCommandDeleteHorizontalRight.js'

export const commandMap = {
  'Editor.deleteCharacterLeft': DeleteCharacterLeft.deleteCharacterLeft,
  'Editor.deleteHorizontalRight': DeleteHorizontalRight.editorDeleteHorizontalRight
}
