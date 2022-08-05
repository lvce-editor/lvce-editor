import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandToggleBlockComment from './EditorCommandToggleBlockComment.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.toggleBlockComment', Viewlet.wrapViewletCommand('EditorText', EditorCommandToggleBlockComment.editorToggleBlockComment))
}
