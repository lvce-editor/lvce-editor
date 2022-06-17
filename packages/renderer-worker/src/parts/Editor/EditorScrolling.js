const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

// TODO this should be in a separate scrolling module
export const setDeltaY = (editor, value) => {
  const newDeltaY = clamp(value, 0, editor.finalDeltaY)
  if (editor.deltaY === newDeltaY) {
    return editor
  }
  const newLineY = Math.floor(newDeltaY / 20)
  const newMaxLineY = editor.minLineY + editor.numberOfVisibleLines
  const scrollBarY =
    (newDeltaY / editor.finalDeltaY) * (editor.height - editor.scrollBarHeight)
  return {
    ...editor,
    minLineY: newLineY,
    maxLineY: newMaxLineY,
    deltaY: newDeltaY,
    scrollBarY,
  }
}
