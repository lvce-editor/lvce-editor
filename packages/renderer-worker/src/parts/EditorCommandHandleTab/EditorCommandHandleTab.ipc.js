import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandHandleTab from './EditorCommandHandleTab.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.handleTab', Viewlet.wrapViewletCommand('EditorText', EditorCommandHandleTab.editorHandleTab))
}
