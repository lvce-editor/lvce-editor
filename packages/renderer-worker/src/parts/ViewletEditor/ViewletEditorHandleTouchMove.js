import * as EditorHandleTouchStart from './ViewletEditorHandleTouchStart.js/index.js'
import * as EditorSetDeltaY from './ViewletEditorSetDeltaY.js'

export const editorHandleTouchMove = (editor, touchEvent) => {
  if (touchEvent.touches.length === 0) {
    return
  }
  const firstTouch = touchEvent.touches[0]
  const offsetY =
    EditorHandleTouchStart.state.deltaY +
    (EditorHandleTouchStart.state.touchOffsetY - firstTouch.y)
  EditorSetDeltaY.setDeltaYFixedValue(editor, offsetY)
}
