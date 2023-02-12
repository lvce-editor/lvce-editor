import * as EditorSplitDirectionType from '../EditorSplitDirectionType/EditorSplitDirectionType.js'

export const getEditorSplitDirectionType = (x, y, width, height, eventX, eventY) => {
  const relativeX = eventX - x
  const relativeY = eventY - y
  const percentX = relativeX / width
  const percentY = relativeY / height
  if (percentX < 0.25) {
    return EditorSplitDirectionType.Left
  }
  if (percentX > 0.75) {
    return EditorSplitDirectionType.Right
  }
  if (percentY < 0.25) {
    return EditorSplitDirectionType.Up
  }
  if (percentY > 0.75) {
    return EditorSplitDirectionType.Down
  }
  return EditorSplitDirectionType.None
}
