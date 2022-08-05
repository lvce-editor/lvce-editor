import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSave from './EditorCommandSave.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.save', Viewlet.wrapViewletCommand('EditorText', EditorCommandSave.editorSave))
}
