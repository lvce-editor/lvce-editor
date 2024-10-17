import * as EditorStrings from '../EditorStrings/EditorStrings.js'
import * as GetExtensions from '../GetExtensions/GetExtensions.js'

const getCodeActionsFromExtension = (extension) => {
  // TODO
  if (!extension) {
    return []
  }
  return extension.codeActions
}

export const getEditorSourceActions = async () => {
  const extensions = await GetExtensions.getExtensions()
  const codeActions = extensions.flatMap(getCodeActionsFromExtension)
  console.log({ codeActions })
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
