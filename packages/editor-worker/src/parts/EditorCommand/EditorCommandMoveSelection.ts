// @ts-ignore
import * as CompareResultType from '../CompareResultType/CompareResultType.ts'
// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as EditorMoveSelectionAnchorState from '../EditorMoveSelectionAnchorState/EditorMoveSelectionAnchorState.ts'

// @ts-ignore
const compare = (positionA, positionB) => {
  if (positionA.rowIndex > positionB.rowIndex) {
    return CompareResultType.GreaterThan
  }
  if (positionA.rowIndex === positionB.rowIndex) {
    if (positionA.columnIndex > positionB.columnIndex) {
      return CompareResultType.GreaterThan
    }
    if (positionA.columnIndex < positionB.columnIndex) {
      return CompareResultType.LessThan
    }
    return CompareResultType.Equal
  }
  return CompareResultType.LessThan
}

// @ts-ignore
const editorMoveSelectionBackwards = (anchor, position) => {
  return new Uint32Array([anchor.rowIndex, anchor.columnIndex, position.rowIndex, position.columnIndex])
}

// @ts-ignore
const editorMoveSelectionEqual = (anchor, position) => {
  return new Uint32Array([position.rowIndex, position.columnIndex, position.rowIndex, position.columnIndex])
}

// @ts-ignore
const editorMoveSelectionForwards = (anchor, position) => {
  return new Uint32Array([anchor.rowIndex, anchor.columnIndex, position.rowIndex, position.columnIndex])
}

// @ts-ignore
const getNewSelections = (anchor, position) => {
  switch (compare(position, anchor)) {
    case CompareResultType.LessThan:
      return editorMoveSelectionBackwards(anchor, position)
    case CompareResultType.Equal:
      return editorMoveSelectionEqual(anchor, position)
    case CompareResultType.GreaterThan:
      return editorMoveSelectionForwards(anchor, position)
    default:
      throw new Error('unexpected comparison result')
  }
}

// @ts-ignore
export const editorMoveSelection = (editor, position) => {
  const anchor = EditorMoveSelectionAnchorState.getPosition()
  const newSelections = getNewSelections(anchor, position)
  // TODO if selection equals previous selection -> do nothing
  return Editor.scheduleSelections(editor, newSelections)
}
