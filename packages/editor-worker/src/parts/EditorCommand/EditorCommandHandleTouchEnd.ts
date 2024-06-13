import * as EditorPosition from './EditorCommandPosition.ts'
import * as EditorHandleTouchStart from './EditorCommandHandleTouchStart.ts'
import * as EditorSelectWord from './EditorCommandSelectWord.ts'
import * as EditorCursorSet from './EditorCommandCursorSet.ts'
import * as EditorMoveSelection from './EditorCommandMoveSelection.ts'

const LONG_TOUCH_THRESHOLD = 150

// @ts-ignore
export const handleTouchEnd = (editor, touchEvent) => {
  if (touchEvent.changedTouches.length === 0) {
    return
  }
  const firstTouch = touchEvent.changedTouches[0]
  const position = EditorPosition.at(editor, firstTouch.x, firstTouch.y)
  // @ts-ignore
  if (EditorMoveSelection.state.position.rowIndex === position.rowIndex && EditorMoveSelection.state.position.columnIndex === position.columnIndex) {
    // @ts-ignore
    if (Date.now() - EditorHandleTouchStart.state.date > LONG_TOUCH_THRESHOLD) {
      EditorSelectWord.selectWord(editor, position.rowIndex, position.columnIndex)
    } else {
      // @ts-ignore
      EditorCursorSet.cursorSet(editor, position)
    }
  } else {
    console.log('different position')
  }
}
