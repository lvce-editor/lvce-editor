import * as CompareResultType from '../CompareResultType/CompareResultType.js'
import * as Editor from '../Editor/Editor.js'
import * as EditorMoveSelectionAnchorState from '../EditorMoveSelectionAnchorState/EditorMoveSelectionAnchorState.js'

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

const editorMoveSelectionBackwards = (anchor, position) => {
  return new Uint32Array([anchor.rowIndex, anchor.columnIndex, position.rowIndex, position.columnIndex])
}

const editorMoveSelectionEqual = (anchor, position) => {
  return new Uint32Array([position.rowIndex, position.columnIndex, position.rowIndex, position.columnIndex])
}

const editorMoveSelectionForwards = (anchor, position) => {
  return new Uint32Array([anchor.rowIndex, anchor.columnIndex, position.rowIndex, position.columnIndex])
}

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

export const editorMoveSelection = (editor, position) => {
  const anchor = EditorMoveSelectionAnchorState.getPosition()
  const newSelections = getNewSelections(anchor, position)
  // TODO if selection equals previous selection -> do nothing
  return Editor.scheduleSelections(editor, newSelections)
}
