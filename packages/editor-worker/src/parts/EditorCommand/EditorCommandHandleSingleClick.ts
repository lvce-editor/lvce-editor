import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditorMoveSelectionAnchorState from '../EditorMoveSelectionAnchorState/EditorMoveSelectionAnchorState.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as ModifierKey from '../ModifierKey/ModifierKey.ts'
import * as EditorGoToDefinition from './EditorCommandGoToDefinition.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

// TODO first change cursor position, then run go to definition
// cursor should appear at mousedown position immediately
// @ts-ignore
const handleSingleClickWithAlt = async (editor, position) => {
  const { rowIndex, columnIndex } = position
  const newEditor = { ...editor, selections: new Uint32Array([rowIndex, columnIndex, rowIndex, columnIndex]) }
  // TODO rectangular selection with alt click,
  // but also go to definition with alt click
  const newEditor2 = await EditorGoToDefinition.goToDefinition(newEditor)
  return newEditor2
}

// @ts-ignore
const handleSingleClickWithCtrl = async (editor, position) => {
  const selections = editor.selections
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    if (
      selectionStartRow === position.rowIndex &&
      selectionStartColumn === position.columnIndex &&
      selectionEndRow === position.rowIndex &&
      selectionEndColumn === position.columnIndex
    ) {
      // selection exists -> remove
      const newSelections = new Uint32Array(selections.length - 4)
      newSelections.set(selections.subarray(0, i), 0)
      newSelections.set(selections.subarray(i + 4), i)
      return Editor.scheduleSelections(editor, newSelections)
    }
  }
  // TODO selection does not exist -> add
  // TODO insert in order
  const newSelections = new Uint32Array(selections.length + 4)
  newSelections.set(selections, 0)
  const insertIndex = selections.length
  newSelections[insertIndex] = position.rowIndex
  newSelections[insertIndex + 1] = position.columnIndex
  newSelections[insertIndex + 2] = position.rowIndex
  newSelections[insertIndex + 3] = position.columnIndex
  return Editor.scheduleSelections(editor, newSelections)
}

// @ts-ignore
const handleSingleClickDefault = (editor, position) => {
  EditorMoveSelectionAnchorState.setPosition(position)
  return {
    ...editor,
    selections: new Uint32Array([position.rowIndex, position.columnIndex, position.rowIndex, position.columnIndex]),
    focused: true,
  }
}

// @ts-ignore
const getFn = (modifier) => {
  switch (modifier) {
    case ModifierKey.Alt:
      return handleSingleClickWithAlt
    case ModifierKey.Ctrl:
      return handleSingleClickWithCtrl
    default:
      return handleSingleClickDefault
  }
}

// @ts-ignore
export const handleSingleClick = async (editor, modifier, x, y) => {
  Assert.object(editor)
  Assert.number(modifier)
  Assert.number(x)
  Assert.number(y)
  const position = EditorPosition.at(editor, x, y)
  const fn = getFn(modifier)
  const newEditor = await fn(editor, position)
  // switch (newEditor.completionState) {
  //   case EditorCompletionState.None:
  //   case EditorCompletionState.Visible:
  //   case EditorCompletionState.Loading:
  //     return {
  //       newState: newEditor,
  //       commands: [],
  //     }
  //   default:
  //     break
  // }
  return newEditor
}
