import * as FileSystem from '../FileSystem/FileSystem.js'

export const getTextEditorContent = async (uri) => {
  try {
    const content = await FileSystem.readFile(uri)
    // TODO if content is not of type string, throw error
    const actualContent = content ?? 'content could not be loaded'
    return actualContent
  } catch {
    return 'content could not be loaded'
  }
}
