import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandMoveLineDown from './EditorCommandMoveLineDown.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.moveLineDown', Viewlet.wrapViewletCommand('EditorText', EditorCommandMoveLineDown.editorMoveLineDown))
}
