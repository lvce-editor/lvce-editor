import * as Assert from '../Assert/Assert.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as EditorPasteText from './EditorCommandPasteText.ts'

export const paste = async (editor: any) => {
  const text = await RendererWorker.invoke('ClipBoard.readText')
  Assert.string(text)
  return EditorPasteText.pasteText(editor, text)
}
