import * as FileSystem from '../FileSystem/FileSystem.js'

export const getTextEditorContent = async (uri) => {
  const content = await FileSystem.readFile(uri)
  const actualContent = content ?? 'content could not be loaded'
  actualContent
}
