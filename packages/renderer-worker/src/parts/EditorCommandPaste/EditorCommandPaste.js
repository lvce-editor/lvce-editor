import * as Command from '../Command/Command.js'
import * as Assert from '../Assert/Assert.js'
import * as EditorPasteText from '../EditorCommandPasteText/EditorCommandPasteText.js'

export const editorPaste = async (editor) => {
  const text = await Command.execute(
    /* ClipBoard.readText */ 'ClipBoard.readText'
  )
  Assert.string(text)
  return EditorPasteText.editorPasteText(editor, text)
}
