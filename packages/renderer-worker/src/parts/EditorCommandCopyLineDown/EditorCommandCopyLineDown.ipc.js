import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandCopyLineDown from './EditorCommandCopyLineDown.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.copyLineDown', Viewlet.wrapViewletCommand('EditorText', EditorCommandCopyLineDown.editorCopyLineDown))

}
