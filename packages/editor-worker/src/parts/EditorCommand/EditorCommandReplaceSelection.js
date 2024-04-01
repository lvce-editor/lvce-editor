import * as EditorCommandReplaceRange from './EditorCommandReplaceRange.js'

export const editorReplaceSelections = (editor, replacement, origin) => {
  const { selections } = editor
  return EditorCommandReplaceRange.replaceRange(editor, selections, replacement, origin)
}
