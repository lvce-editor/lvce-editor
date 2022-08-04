import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandHandleTripleClick from './EditorCommandHandleTripleClick.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.handleTripleClick', Viewlet.wrapViewletCommand('EditorText', EditorCommandHandleTripleClick.editorHandleTripleClick))
}
