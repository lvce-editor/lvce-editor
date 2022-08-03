import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandCursorWordRight from './EditorCommandCursorWordRight.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.cursorWordRight', Viewlet.wrapViewletCommand('EditorText', EditorCommandCursorWordRight.editorCursorWordRight))
}
