import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandMoveSelection from './EditorCommandMoveSelection.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.moveSelection', Viewlet.wrapViewletCommand('EditorText', EditorCommandMoveSelection.editorMoveSelection))
}
