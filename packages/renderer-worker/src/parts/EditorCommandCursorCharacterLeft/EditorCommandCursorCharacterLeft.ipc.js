import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandCursorCharacterLeft from './EditorCommandCursorCharacterLeft.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.cursorLeft', Viewlet.wrapViewletCommand('EditorText', EditorCommandCursorCharacterLeft.editorCursorCharacterLeft))

}
