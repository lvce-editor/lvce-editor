import * as Command from '../Command/Command.js'
import * as Assert from '../Assert/Assert.js'
import * as EditorPasteText from './EditorCommandPasteText.js'

export const paste = async (editor) => {
  const text = await Command.execute(
    /* ClipBoard.readText */ 'ClipBoard.readText'
  )
  Assert.string(text)
  return EditorPasteText.pasteText(editor, text)
}
