import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandCursorWordPartLeft from './EditorCommandCursorWordPartLeft.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.cursorWordPartLeft', Viewlet.wrapViewletCommand('EditorText', EditorCommandCursorWordPartLeft.editorCursorWordPartLeft))
}
