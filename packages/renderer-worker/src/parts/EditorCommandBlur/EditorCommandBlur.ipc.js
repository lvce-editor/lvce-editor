import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorBlur from './EditorCommandBlur.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.blur', Viewlet.wrapViewletCommand('EditorText', EditorBlur.editorBlur)) // TODO needed?

}
