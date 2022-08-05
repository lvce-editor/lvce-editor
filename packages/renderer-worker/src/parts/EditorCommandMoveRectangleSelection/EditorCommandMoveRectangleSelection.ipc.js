import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandMoveRectangleSelection from './EditorCommandMoveRectangleSelection.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.moveRectangleSelection', Viewlet.wrapViewletCommand('EditorText', EditorCommandMoveRectangleSelection.editorMoveRectangleSelection))
}
