export const editorHandleWheel = (editor, y) => {
  const newDeltaY = clamp(editor.deltaY + y, 0, editor.finalDeltaY)
  if (editor.deltaY === newDeltaY) {
    return
  }
  editor.deltaY = newDeltaY
  const newLineY = Math.floor(newDeltaY / 20)
  if (editor.minLineY === newLineY) {
    return
  }
  editor.minLineY = newLineY
  editor.maxLineY = Math.min(
    editor.minLineY + editor.numberOfVisibleLines,
    editor.lines.length
  )

  // TODO
  //
  // renderTextAndCursorAndSelections(editor)
}
