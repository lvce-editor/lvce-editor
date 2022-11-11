import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import { VError } from '../VError/VError.js'
import * as EditorFormat from './EditorCommandFormat.js'

const getFormatOnSave = () => {
  const value = Preferences.get('editor.formatOnSave')
  return Boolean(value)
}

const getNewEditor = async (editor) => {
  const formatOnSave = getFormatOnSave()
  if (formatOnSave) {
    return EditorFormat.format(editor)
  }
  return editor
}

export const save = async (editor) => {
  try {
    const uri = editor.uri
    const newEditor = await getNewEditor(editor)
    const content = TextDocument.getText(newEditor)
    await FileSystem.writeFile(uri, content)
    return newEditor
  } catch (error) {
    // @ts-ignore
    const betterError = new VError(error, `Failed to save file "${editor.uri}"`)
    await ErrorHandling.handleError(betterError)
    return
  }
}
