import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandMoveLineUp from './EditorCommandMoveLineUp.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.moveLineUp', Viewlet.wrapViewletCommand('EditorText', EditorCommandMoveLineUp.editorMoveLineUp))
}
