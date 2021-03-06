import * as Editor from '../Editor/Editor.js'

// TODO not sure where this state should be
// TODO maybe rename to selection anchor
export const state = {
  position: {
    rowIndex: 0,
    columnIndex: 0,
  },
}

const compare = (positionA, positionB) => {
  if (positionA.rowIndex > positionB.rowIndex) {
    return 1
  }
  if (positionA.rowIndex === positionB.rowIndex) {
    if (positionA.columnIndex > positionB.columnIndex) {
      return 1
    }
    if (positionA.columnIndex < positionB.columnIndex) {
      return -1
    }
    return 0
  }
  return -1
}

const editorMoveSelectionBackwards = (editor, anchor, position) => {
  const selectionEdits = [
    {
      start: position,
      end: anchor,
    },
  ]
  return Editor.scheduleSelections(editor, selectionEdits)
}

const editorMoveSelectionEqual = (editor, anchor, position) => {
  const selectionEdits = [
    {
      start: position,
      end: position,
      type: 1,
    },
  ]
  return Editor.scheduleSelections(editor, selectionEdits)
}

const editorMoveSelectionForwards = (editor, anchor, position) => {
  const selectionEdits = [
    {
      start: anchor,
      end: position,
    },
  ]
  return Editor.scheduleSelections(editor, selectionEdits)
}

export const editorMoveSelection = (editor, position) => {
  const anchor = state.position
  // TODO if selection equals previous selection -> do nothing
  switch (compare(position, anchor)) {
    case -1:
      return editorMoveSelectionBackwards(editor, anchor, position)
    case 0:
      return editorMoveSelectionEqual(editor, anchor, position)
    case 1:
      return editorMoveSelectionForwards(editor, anchor, position)
    default:
      break
  }
}
