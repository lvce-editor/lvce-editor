import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandHandleSingleClick from './EditorCommandHandleSingleClick.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.handleSingleClick', Viewlet.wrapViewletCommand('EditorText', EditorCommandHandleSingleClick.editorHandleSingleClick))
}
