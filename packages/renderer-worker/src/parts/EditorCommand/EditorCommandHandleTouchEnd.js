import * as EditorPosition from './EditorCommandPosition.js'
import * as EditorHandleTouchStart from './EditorCommandHandleTouchStart.js'
import * as EditorSelectWord from './EditorCommandSelectWord.js'
import * as EditorCursorSet from './EditorCommandCursorSet.js'
import * as EditorMoveSelection from './EditorCommandMoveSelection.js'

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
