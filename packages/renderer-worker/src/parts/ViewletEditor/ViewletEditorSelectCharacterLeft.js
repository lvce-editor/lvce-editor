import * as EditorSelectHorizontalLeft from './ViewletEditorSelectHorizontalLeft.js/index.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorSelectCharacterLeft = (editor) => {
  return EditorSelectHorizontalLeft.editorSelectHorizontalLeft(
    editor,
    EditorDelta.characterLeft
  )
}
