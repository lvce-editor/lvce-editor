import * as EditorSelection from '../EditorSelection/EditorSelection.js'
import * as EditorCommandCutLine from './EditorCommandCutLine.js'
import * as EditorCommandCutSelectedText from './EditorCommandCutSelectedText.js'

export const cut = (editor) => {
  const { selections } = editor
  const [startRowIndex, startColumnIndex, endRowIndex, endColumnIndex] = selections
  if (EditorSelection.isEmpty(startRowIndex, startColumnIndex, endRowIndex, endColumnIndex)) {
    return EditorCommandCutLine.cutLine(editor)
  }
  return EditorCommandCutSelectedText.cutSelectedText(editor)
}
