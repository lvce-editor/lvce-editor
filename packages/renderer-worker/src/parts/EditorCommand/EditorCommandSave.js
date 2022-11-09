import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Preferences from '../Preferences/Preferences.js'
import { VError } from '../VError/VError.js'

const getFormatOnSave = () => {
  const value = Preferences.get('editor.formatOnSave')
  return Boolean(value)
}

export const save = async (editor) => {
  try {
    const uri = editor.uri
    const content = TextDocument.getText(editor)
    const formatOnSave = getFormatOnSave()

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
