import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandHandleScrollBarClick from './EditorCommandHandleScrollBarClick.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.handleScrollBarClick', Viewlet.wrapViewletCommand('EditorText', EditorCommandHandleScrollBarClick.editorHandleScrollBarClick))
}
