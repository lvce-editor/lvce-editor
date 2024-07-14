import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as ApplyDocumentEdits from './EditorCommandApplyDocumentEdits.ts'

export const organizeImports = async (editor: any) => {
  // TODO ask extension host worker directly
  const edits = await RendererWorker.invoke('ExtensionHostOrganizeImports.organizeImports', editor)
  console.log({ edits })
  return ApplyDocumentEdits.applyDocumentEdits(editor, edits)
}
