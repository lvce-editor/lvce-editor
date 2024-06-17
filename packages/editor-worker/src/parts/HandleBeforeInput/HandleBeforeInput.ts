import * as EditorTypeWithAutoClosing from '../EditorCommand/EditorCommandTypeWithAutoClosing.ts'
import * as InputEventType from '../InputEventType/InputEventType.ts'

export const handleBeforeInput = (editor: any, inputType: string, data: string) => {
  switch (inputType) {
    case InputEventType.InsertText:
      return EditorTypeWithAutoClosing.typeWithAutoClosing(editor, data)
    default:
      return editor
  }
}
