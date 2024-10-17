import * as GetExtensions from '../GetExtensions/GetExtensions.js'

const getCodeActionsFromExtension = (extension) => {
  if (!extension) {
    return []
  }
  if (!extension.codeActions) {
    return []
  }
  // TODO verify that elements are valid
  return extension.codeActions
}

export const getEditorSourceActions = async () => {
  const extensions = await GetExtensions.getExtensions()
  const codeActions = extensions.flatMap(getCodeActionsFromExtension)
  return codeActions
}
