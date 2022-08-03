import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCursorDown from './EditorCommandCursorDown.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.cursorDown', Viewlet.wrapViewletCommand('EditorText', EditorCursorDown.editorCursorsDown))
}
