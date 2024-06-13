import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
// @ts-ignore
// @ts-ignore
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.ts'
import { VError } from '../VError/VError.ts'
import * as EditorFormat from './EditorCommandFormat.ts'
// import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const getFormatOnSave = () => {
  // TODO query setting on editor creation
  // const value = Preferences.get('editor.formatOnSave')
  // return Boolean(value)
  return false
}

// @ts-ignore
const getNewEditor = async (editor) => {
  const formatOnSave = getFormatOnSave()
  if (formatOnSave) {
    return EditorFormat.format(editor)
  }
  return editor
}

// @ts-ignore
export const save = async (editor) => {
  try {
    const uri = editor.uri
    const newEditor = await getNewEditor(editor)
    const content = TextDocument.getText(newEditor)
    await RendererWorker.invoke('FileSystem.writeFile', uri, content)
    return newEditor
  } catch (error) {
    // @ts-ignore
    const betterError = new VError(error, `Failed to save file "${editor.uri}"`)
    await ErrorHandling.handleError(betterError)
    return editor
  }
}
