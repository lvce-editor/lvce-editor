import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandToggleComment from './EditorCommandToggleComment.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.toggleComment', Viewlet.wrapViewletCommand('EditorText', EditorCommandToggleComment.editorToggleComment))
}
