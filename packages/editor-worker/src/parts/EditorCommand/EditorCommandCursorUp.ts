import * as EditorCursorVertical from './EditorCommandCursorVertical.ts'

// @ts-ignore
const getEdgePosition = (editor) => {
  return {
    rowIndex: 0,
    columnIndex: 0,
  }
}

// @ts-ignore
const getPosition = (selection) => {
  return selection.start
}

// @ts-ignore
export const cursorUp = (editor) => {
  return EditorCursorVertical.cursorVertical(editor, getPosition, getEdgePosition, -1)
}
