import * as Assert from '../Assert/Assert.js'
import * as Editor from '../Editor/Editor.js'
import * as ModifierKey from '../ModifierKey/ModifierKey.js'
import * as EditorGoToDefinition from './EditorCommandGoToDefinition.js'
import * as EditorMoveSelection from './EditorCommandMoveSelection.js'
import * as EditorPosition from './EditorCommandPosition.js'

const handleSingleClickWithAlt = async (editor, position) => {
  // TODO rectangular selection with alt click,
  // but also go to definition with alt click
  console.log('alt key pressed')
  const newEditor = await EditorGoToDefinition.editorGoToDefinition(
    editor,
    position,
    /* explicit */ false
  )
  return newEditor
}

const handleSingleClickWithCtrl = async (editor, position) => {
  const selections = editor.selections
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
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
  EditorMoveSelection.state.position = position
  return {
    ...editor,
    selections: new Uint32Array([
      position.rowIndex,
      position.columnIndex,
      position.rowIndex,
      position.columnIndex,
    ]),
    focused: true,
  }
}

export const editorHandleSingleClick = (editor, modifier, x, y, offset) => {
  Assert.object(editor)
  Assert.string(modifier)
  Assert.number(x)
  Assert.number(y)
  Assert.number(offset)
  const position = EditorPosition.at(editor, x, y, offset)
  console.log({ position })
  switch (modifier) {
    case ModifierKey.Alt:
      return handleSingleClickWithAlt(editor, position)
    case ModifierKey.Ctrl:
      return handleSingleClickWithCtrl(editor, position)
    default:
      return handleSingleClickDefault(editor, position)
  }
}
