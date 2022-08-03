import * as Command from '../Command/Command.js'
import * as EditorCancelSelection from '../EditorCommandCancelSelection/EditorCommandCancelSelection.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.cancelSelection', Viewlet.wrapViewletCommand('EditorText', EditorCancelSelection.editorCancelSelection))

}
