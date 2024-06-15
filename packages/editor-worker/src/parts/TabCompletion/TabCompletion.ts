import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const getTabCompletion = async (editor: any) => {
  const { selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const tabCompletion = await RendererWorker.invoke('ExtensionHostTabCompletion.executeTabCompletionProvider', editor, offset)
  return tabCompletion
}
