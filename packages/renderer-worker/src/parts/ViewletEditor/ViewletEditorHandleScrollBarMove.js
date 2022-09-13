import * as Editor from '../Editor/Editor.js'
import * as EditorHandleScrollBarClick from './ViewletEditorHandleScrollBarClick.js'

const getNewPercent = (editor, relativeY) => {
  console.log({ editor, relativeY })
  // if (relativeY <= editor.scrollBarHeight / 2) {
  //   console.log('clicked at top')
  //   // clicked at top
  //   return 0
  // }
  if (relativeY <= editor.height - editor.scrollBarHeight / 2) {
    // clicked in middle
    return relativeY / (editor.height - editor.scrollBarHeight)
  }
  // clicked at bottom
  return 1
}

export const editorHandleScrollBarMove = (editor, y) => {
  const relativeY =
    y - editor.top - EditorHandleScrollBarClick.state.handleOffset
  console.log('handle offset', EditorHandleScrollBarClick.state.handleOffset)
  const newPercent = getNewPercent(editor, relativeY)
  const newDeltaY = newPercent * editor.finalDeltaY
  return Editor.setDeltaYFixedValue(editor, newDeltaY)
}
