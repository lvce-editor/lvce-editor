import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandHandleContextMenu from './EditorCommandHandleContextMenu.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.handleContextMenu', Viewlet.wrapViewletCommand('EditorText', EditorCommandHandleContextMenu.editorHandleContextMenu))
}
