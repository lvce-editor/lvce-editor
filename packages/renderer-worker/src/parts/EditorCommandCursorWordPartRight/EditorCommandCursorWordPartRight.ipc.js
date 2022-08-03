import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandCursorWordPartRight from './EditorCommandCursorWordPartRight.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.cursorWordPartRight', Viewlet.wrapViewletCommand('EditorText', EditorCommandCursorWordPartRight.editorCursorWordPartRight))
}
