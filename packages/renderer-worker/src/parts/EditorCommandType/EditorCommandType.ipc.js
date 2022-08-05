import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandType from './EditorCommandType.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.type', Viewlet.wrapViewletCommand('EditorText', EditorCommandType.editorType))
}
