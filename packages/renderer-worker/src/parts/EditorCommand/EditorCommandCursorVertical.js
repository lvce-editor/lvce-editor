import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as TextSegmenter from '../TextSegmenter/TextSegmenter.js'

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
  console.log({ selectionEdits })
  return Editor.scheduleSelections(editor, selectionEdits)
}

const moveSelectionWithoutIntlSegmenter = (selection) => {
  if (selection.start.rowIndex === 0) {
    const newPosition = {
      rowIndex: 0,
      columnIndex: 0,
    }
    return {
      start: newPosition,
      end: newPosition,
    }
  }
  const newPosition = {
    rowIndex: selection.start.rowIndex - 1,
    columnIndex: selection.start.columnIndex,
  }
  return {
    start: newPosition,
    end: newPosition,
  }
}

const editorCursorsVerticalWithoutIntlSegmenter = (editor) => {
  const selectionEdits = editor.selections.map(
    moveSelectionWithoutIntlSegmenter
  )
  return Editor.scheduleSelections(editor, selectionEdits)
}

export const editorCommandCursorVertical = (
  editor,
  getPosition,
  getEdgePosition,
  delta
) => {
  if (TextSegmenter.supported()) {
    return editorCursorsVerticalWithIntlSegmenter(
      editor,
      getPosition,
      getEdgePosition,
      delta
    )
  }
  return editorCursorsVerticalWithoutIntlSegmenter(editor)
}
