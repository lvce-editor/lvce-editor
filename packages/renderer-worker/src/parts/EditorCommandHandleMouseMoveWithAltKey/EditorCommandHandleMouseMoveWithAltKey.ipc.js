import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandHandleMouseMoveWithAltKey from './EditorCommandHandleMouseMoveWithAltKey.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.handleMouseMoveWithAltKey', Viewlet.wrapViewletCommand('EditorText', EditorCommandHandleMouseMoveWithAltKey.editorHandleMouseMoveWithAltKey))
}
