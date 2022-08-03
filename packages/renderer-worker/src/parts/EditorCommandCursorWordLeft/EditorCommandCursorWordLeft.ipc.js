import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandCursorWordLeft from './EditorCommandCursorWordLeft.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.cursorWordLeft', Viewlet.wrapViewletCommand('EditorText', EditorCommandCursorWordLeft.editorCursorWordLeft))
}
