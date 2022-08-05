import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandMoveSelectionPx from './EditorCommandMoveSelectionPx.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.moveSelectionPx', Viewlet.wrapViewletCommand('EditorText', EditorCommandMoveSelectionPx.editorMoveSelectionPx))
}
