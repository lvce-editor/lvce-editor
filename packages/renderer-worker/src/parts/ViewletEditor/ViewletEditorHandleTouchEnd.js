import * as EditorPosition from './ViewletEditorPosition.js/index.js'
import * as EditorHandleTouchStart from './ViewletEditorHandleTouchStart.js/index.js'
import * as EditorSelectWord from './ViewletEditorSelectWord.js'
import * as EditorCursorSet from './ViewletEditorCursorSet.js/index.js'
import * as EditorMoveSelection from './ViewletEditorMoveSelection.js/index.js'

const LONG_TOUCH_THRESHOLD = 150

export const editorHandleTouchEnd = (editor, touchEvent) => {
  if (touchEvent.changedTouches.length === 0) {
    return
  }
  const firstTouch = touchEvent.changedTouches[0]
  const position = EditorPosition.at(editor, firstTouch.x, firstTouch.y)
  if (
    EditorMoveSelection.state.position.rowIndex === position.rowIndex &&
    EditorMoveSelection.state.position.columnIndex === position.columnIndex
  ) {
    if (Date.now() - EditorHandleTouchStart.state.date > LONG_TOUCH_THRESHOLD) {
      EditorSelectWord.editorSelectWord(
        editor,
        position.rowIndex,
        position.columnIndex
      )
    } else {
      EditorCursorSet.editorCursorSet(editor, position)
    }
  } else {
    console.log('different position')
  }
}
