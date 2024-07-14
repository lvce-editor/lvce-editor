import * as EditorStrings from '../EditorStrings/EditorStrings.js'

export const getEditorSourceActions = async () => {
  const sourceActions = [
    {
      name: EditorStrings.organizeImports(),
      command: 'Editor.organizeImports',
    },
    {
      name: EditorStrings.sortImports(),
      command: 'Editor.sortImports',
    },
  ]
  return sourceActions
}
