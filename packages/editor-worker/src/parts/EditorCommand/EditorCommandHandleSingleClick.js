import * as Assert from '../Assert/Assert.ts'
// @ts-ignore
import * as Editor from '../Editor/Editor.js'
// import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.js'
// @ts-ignore
import * as EditorFunctionType from '../EditorFunctionType/EditorFunctionType.js'
// @ts-ignore
import * as EditorMoveSelectionAnchorState from '../EditorMoveSelectionAnchorState/EditorMoveSelectionAnchorState.js'
// @ts-ignore
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.js'
// @ts-ignore
import * as ModifierKey from '../ModifierKey/ModifierKey.js'
import * as EditorGoToDefinition from './EditorCommandGoToDefinition.js'
import * as EditorPosition from './EditorCommandPosition.js'

// TODO first change cursor position, then run go to definition
// cursor should appear at mousedown position immediately
const handleSingleClickWithAlt = async (editor, position) => {
  const { rowIndex, columnIndex } = position
  const newEditor = { ...editor, selections: new Uint32Array([rowIndex, columnIndex, rowIndex, columnIndex]) }
  // TODO rectangular selection with alt click,
  // but also go to definition with alt click
  const newEditor2 = await EditorGoToDefinition.goToDefinition(newEditor)
  return newEditor2
}

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

const handleSingleClickDefault = (editor, position) => {
  EditorMoveSelectionAnchorState.setPosition(position)
  return {
    ...editor,
    selections: new Uint32Array([position.rowIndex, position.columnIndex, position.rowIndex, position.columnIndex]),
    focused: true,
  }
}

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
  return {
    newState: newEditor,
    commands: [],
  }
}
