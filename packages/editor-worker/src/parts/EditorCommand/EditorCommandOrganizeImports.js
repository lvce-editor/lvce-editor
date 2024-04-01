// @ts-ignore
import * as OrganizeImports from '../OrganizeImports/OrganizeImports.js'
import * as ApplyDocumentEdits from './EditorCommandApplyDocumentEdits.js'

export const organizeImports = async (editor) => {
  const edits = await OrganizeImports.organizeImports(editor)
  return ApplyDocumentEdits.applyDocumentEdits(editor, edits)
}
