import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

export const editorSave = async (editor) => {
  const uri = editor.uri
  const content = TextDocument.getText(editor)
  try {
    await FileSystem.writeFile(uri, content)
  } catch (error) {
    // @ts-ignore
    const betterError = new Error(`Failed to save file "${uri}"`, {
      cause: error,
    })
    await ErrorHandling.handleError(betterError)
    return
  }
  await GlobalEventBus.emitEvent('editor.save', editor)
  return editor
}
