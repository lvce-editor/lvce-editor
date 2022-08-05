import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandHandleScrollBarMove from './EditorCommandHandleScrollBarMove.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.handleScrollBarMove', Viewlet.wrapViewletCommand('EditorText', EditorCommandHandleScrollBarMove.editorHandleScrollBarMove))
}
