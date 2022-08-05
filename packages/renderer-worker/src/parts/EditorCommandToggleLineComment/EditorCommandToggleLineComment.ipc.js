import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandToggleLineComment from './EditorCommandToggleLineComment.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.toggleLineComment', Viewlet.wrapViewletCommand('EditorText', EditorCommandToggleLineComment.editorToggleLineComment))
}
