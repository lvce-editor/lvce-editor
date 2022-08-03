import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandCursorCharacterRight from './EditorCommandCursorCharacterRight.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.cursorRight', Viewlet.wrapViewletCommand('EditorText', EditorCommandCursorCharacterRight.editorCursorsCharacterRight))

}
