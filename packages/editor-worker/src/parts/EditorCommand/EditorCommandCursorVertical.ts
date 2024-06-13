// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.ts'
// @ts-ignore
import * as TextSegmenter from '../TextSegmenter/TextSegmenter.ts'
// @ts-ignore
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

// @ts-ignore
const editorCursorsVerticalWithIntlSegmenter = (editor, getPosition, getEdgePosition, delta) => {
  const edgePosition = getEdgePosition(editor)
  // @ts-ignore
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
    const lineCurrentVisualIndex = segmenter.visualIndex(lineCurrent, position.columnIndex)

    const lineOtherModelIndex = segmenter.modelIndex(lineOther, lineCurrentVisualIndex)

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

// @ts-ignore
const moveSelectionWithoutIntlSegmenter = (selections, i, selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn) => {
  if (selectionStartRow === 0) {
    EditorSelection.moveRangeToPosition(selections, i, 0, 0)
  } else {
    EditorSelection.moveRangeToPosition(selections, i, selectionStartRow - 1, selectionStartColumn)
  }
}

// @ts-ignore
const getNewSelections = (selections) => {
  return EditorSelection.map(selections, moveSelectionWithoutIntlSegmenter)
}

// @ts-ignore
export const cursorVertical = (editor, getPosition, getEdgePosition, delta) => {
  // if (TextSegmenter.supported()) {
  //   return editorCursorsVerticalWithIntlSegmenter(
  //     editor,
  //     getPosition,
  //     getEdgePosition,
  //     delta
  //   )
  // }
  const selections = editor.selections
  // @ts-ignore
  const newSelections = getNewSelections(selections, delta)
  return Editor.scheduleSelections(editor, newSelections)
}
