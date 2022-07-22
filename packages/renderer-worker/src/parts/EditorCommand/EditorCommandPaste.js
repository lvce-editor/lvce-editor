import * as Command from '../Command/Command.js'
import * as EditorPasteText from './EditorCommandPasteText.js'
import * as Assert from '../Assert/Assert.js'

export const editorPaste = async (editor) => {
  const text = await Command.execute(
    /* ClipBoard.readText */ 'ClipBoard.readText'
  )
  Assert.string(text)
  return EditorPasteText.editorPasteText(editor, text)
}
