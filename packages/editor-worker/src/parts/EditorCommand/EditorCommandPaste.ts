import * as Command from '../Command/Command.ts'
import * as Assert from '../Assert/Assert.ts'
import * as EditorPasteText from './EditorCommandPasteText.ts'

export const paste = async (editor) => {
  const text = await Command.execute(/* ClipBoard.readText */ 'ClipBoard.readText')
  Assert.string(text)
  return EditorPasteText.pasteText(editor, text)
}
