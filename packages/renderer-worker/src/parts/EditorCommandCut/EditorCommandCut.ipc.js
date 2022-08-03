import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandCut from './EditorCommandCut.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.cut', Viewlet.wrapViewletCommand('EditorText', EditorCommandCut.editorCut))
}
