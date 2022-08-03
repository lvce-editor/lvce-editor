import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandHandleDoubleClick from './EditorCommandHandleDoubleClick.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.handleDoubleClick', Viewlet.wrapViewletCommand('EditorText', EditorCommandHandleDoubleClick.editorHandleDoubleClick))
}
