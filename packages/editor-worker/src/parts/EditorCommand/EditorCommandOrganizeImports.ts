// @ts-ignore
import * as OrganizeImports from '../OrganizeImports/OrganizeImports.ts'
import * as ApplyDocumentEdits from './EditorCommandApplyDocumentEdits.ts'

export const organizeImports = async (editor) => {
  const edits = await OrganizeImports.organizeImports(editor)
  return ApplyDocumentEdits.applyDocumentEdits(editor, edits)
}
