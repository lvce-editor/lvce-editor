import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandMoveRectangleSelectionPx from './EditorCommandMoveRectangleSelectionPx.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.moveRectangleSelectionPx', Viewlet.wrapViewletCommand('EditorText', EditorCommandMoveRectangleSelectionPx.editorMoveRectangleSelectionPx))
}
