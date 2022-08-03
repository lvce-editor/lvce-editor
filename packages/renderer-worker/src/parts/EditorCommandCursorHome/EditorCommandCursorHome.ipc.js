import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCursorHome from './EditorCommandCursorHome.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.cursorHome', Viewlet.wrapViewletCommand('EditorText', EditorCursorHome.editorCursorsHome))
}
