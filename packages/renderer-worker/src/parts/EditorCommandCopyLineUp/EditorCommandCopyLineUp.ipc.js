import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandCopyLineUp from './EditorCommandCopyLineUp.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.copyLineUp', Viewlet.wrapViewletCommand('EditorText', EditorCommandCopyLineUp.editorCopyLineUp))

}
