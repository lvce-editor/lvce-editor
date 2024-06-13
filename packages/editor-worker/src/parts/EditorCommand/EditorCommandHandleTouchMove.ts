import * as EditorHandleTouchStart from './EditorCommandHandleTouchStart.ts'
import * as EditorSetDelta from './EditorCommandSetDelta.ts'

// @ts-ignore
export const handleTouchMove = (editor, touchEvent) => {
  if (touchEvent.touches.length === 0) {
    return
  }
  const firstTouch = touchEvent.touches[0]
  const offsetY = EditorHandleTouchStart.state.deltaY + (EditorHandleTouchStart.state.touchOffsetY - firstTouch.y)
  EditorSetDelta.setDeltaYFixedValue(editor, offsetY)
}
