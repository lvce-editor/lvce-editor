import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as Editor from '../Editor/Editor.js'
import * as GetEditorDeltaFunction from '../GetEditorDeltaFunction/GetEditorDeltaFunction.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorGetPositionRight from './EditorCommandGetPositionRight.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

export const editorDeleteHorizontalRight = async (editor, deltaId) => {
  const { tokenizer, ...rest } = editor // TODO new tokenizer api
  const newState = await EditorWorker.invoke('Editor.deleteHorizontalRight', rest, deltaId)
  const newEditor = {
    ...newState,
    tokenizer,
  }
  const changes = editorReplaceSelections(editor, [''], EditOrigin.DeleteHorizontalRight)
  return changes
}
