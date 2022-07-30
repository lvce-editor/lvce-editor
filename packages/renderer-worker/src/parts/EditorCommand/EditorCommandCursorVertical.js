import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as TextSegmenter from '../TextSegmenter/TextSegmenter.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'

const editorCursorsVerticalWithIntlSegmenter = (
  editor,
  getPosition,
  getEdgePosition,
  delta
) => {
  const edgePosition = getEdgePosition(editor)
  const moveSelection = (selection) => {
    const position = getPosition(selection)
    if (position.rowIndex === edgePosition.rowIndex) {
      return {
        start: edgePosition,
        end: edgePosition,
      }
    }

    const lineCurrent = TextDocument.getLine(editor, position.rowIndex)
    const lineOther = TextDocument.getLine(editor, position.rowIndex + delta)

    const segmenter = TextSegmenter.create()
    const lineCurrentVisualIndex = segmenter.visualIndex(
      lineCurrent,
      position.columnIndex
    )

    const lineOtherModelIndex = segmenter.modelIndex(
      lineOther,
      lineCurrentVisualIndex
    )

    const newPosition = {
      rowIndex: position.rowIndex + delta,
      columnIndex: lineOtherModelIndex,
    }
    return {
      start: newPosition,
      end: newPosition,
    }
  }
  const selectionEdits = editor.selections.map(moveSelection)
  return Editor.scheduleSelections(editor, selectionEdits)
}

const moveSelectionWithoutIntlSegmenter = (
  selections,
  i,
  selectionStartRow,
  selectionStartColumn,
  selectionEndRow,
  selectionEndColumn
) => {
  if (selectionStartRow === 0) {
    EditorSelection.moveRangeToPosition(selections, i, 0, 0)
  } else {
    EditorSelection.moveRangeToPosition(
      selections,
      i,
      selectionStartRow - 1,
      selectionStartColumn
    )
  }
}

const getNewSelections = (selections) => {
  return EditorSelection.map(selections, moveSelectionWithoutIntlSegmenter)
}

export const editorCommandCursorVertical = (
  editor,
  getPosition,
  getEdgePosition,
  delta
) => {
  // if (TextSegmenter.supported()) {
  //   return editorCursorsVerticalWithIntlSegmenter(
  //     editor,
  //     getPosition,
  //     getEdgePosition,
  //     delta
  //   )
  // }
  const selections = editor.selections
  const newSelections = getNewSelections(selections)
  return Editor.scheduleSelections(editor, newSelections)
}
