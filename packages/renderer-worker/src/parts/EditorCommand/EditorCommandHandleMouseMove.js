import * as EditorHoverState from '../EditorHoverState/EditorHoverState.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as EditorPosition from './EditorCommandPosition.js'

const showHover = async (editor, position) => {
  // TODO race condition
  await Viewlet.closeWidget(ViewletModuleId.EditorHover)
  await Viewlet.openWidget(ViewletModuleId.EditorHover, position)
}

// TODO several things can happen:
// 1. highlight link when alt key is pressed
// 2. show hover info
// 3. selection moves
// 4. highlight go to definition
const onHoverIdle = async () => {
  const { x, y, editor } = EditorHoverState.get()
  const position = EditorPosition.at(editor, x, y)
  await showHover(editor, position)
}

const hoverDelay = 300

export const handleMouseMove = (editor, x, y) => {
  if (!editor.hoverEnabled) {
    return editor
  }
  const oldState = EditorHoverState.get()
  if (oldState.timeout !== -1) {
    clearTimeout(oldState.timeout)
  }
  const timeout = setTimeout(onHoverIdle, hoverDelay)
  EditorHoverState.set(editor, timeout, x, y)
  return editor
}
