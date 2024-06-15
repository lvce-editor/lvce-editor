import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as ApplyDocumentEdits from './EditorCommandApplyDocumentEdits.ts'

export const organizeImports = async (editor: any) => {
  const edits = await RendererWorker.invoke('ExtensionHostOrganizeImports.organizeImports', editor)
  return ApplyDocumentEdits.applyDocumentEdits(editor, edits)
}
