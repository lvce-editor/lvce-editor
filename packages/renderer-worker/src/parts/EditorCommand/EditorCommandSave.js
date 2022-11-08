import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import { VError } from '../VError/VError.js'

export const save = async (editor) => {
  const uri = editor.uri
  const content = TextDocument.getText(editor)
  try {
    await FileSystem.writeFile(uri, content)
  } catch (error) {
    // @ts-ignore
    const betterError = new VError(error, `Failed to save file "${uri}"`)
    await ErrorHandling.handleError(betterError)
    return
  }
  await GlobalEventBus.emitEvent('editor.save', editor)
  return editor
}
