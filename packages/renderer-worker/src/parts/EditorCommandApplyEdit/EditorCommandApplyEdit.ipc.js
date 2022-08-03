import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorApplyEdit from './EditorCommandApplyEdit.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.applyEdit', Viewlet.wrapViewletCommand('EditorText', EditorApplyEdit.editorApplyEdit)) // TODO needed?

}
