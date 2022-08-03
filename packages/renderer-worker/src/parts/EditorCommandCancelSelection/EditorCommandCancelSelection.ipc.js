import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCancelSelection from './EditorCommandCancelSelection.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.cancelSelection', Viewlet.wrapViewletCommand('EditorText', EditorCancelSelection.editorCancelSelection))

}
