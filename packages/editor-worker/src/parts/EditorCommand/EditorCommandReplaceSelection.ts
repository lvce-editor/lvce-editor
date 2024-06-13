import * as EditorCommandReplaceRange from './EditorCommandReplaceRange.ts'

export const editorReplaceSelections = (editor, replacement, origin) => {
  const { selections } = editor
  return EditorCommandReplaceRange.replaceRange(editor, selections, replacement, origin)
}
