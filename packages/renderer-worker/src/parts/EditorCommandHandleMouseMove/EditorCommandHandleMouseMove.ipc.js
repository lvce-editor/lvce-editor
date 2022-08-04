import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandHandleMouseMove from './EditorCommandHandleMouseMove.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.handleMouseMove', Viewlet.wrapViewletCommand('EditorText', EditorCommandHandleMouseMove.editorHandleMouseMove))
}
