export const state = {
  touchOffsetY: 0,
  deltaY: 0,
}

export const editorHandleTouchStart = (editor, touchEvent) => {
  if (touchEvent.touches.length === 0) {
    return
  }
  const firstTouch = touchEvent.touches[0]
  state.touchOffsetY = firstTouch.y
  state.deltaY = editor.deltaY
  // const position = EditorPosition.at(editor, firstTouch.x, firstTouch.y)
  // EditorMoveSelection.state.position = position
  // state.date = Date.now()
}
