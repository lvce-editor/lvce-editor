import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCursorUp from './EditorCommandCursorUp.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.cursorUp', Viewlet.wrapViewletCommand('EditorText', EditorCursorUp.editorCursorsUp))
}
