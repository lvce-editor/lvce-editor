import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandUndo from './EditorCommandUndo.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.Undo', Viewlet.wrapViewletCommand('EditorText', EditorCommandUndo.editorUndo))
}
