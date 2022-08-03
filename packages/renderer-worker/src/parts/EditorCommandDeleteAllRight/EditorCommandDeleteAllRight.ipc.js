import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandDeleteAllRight from './EditorCommandDeleteAllRight.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.deleteAllRight', Viewlet.wrapViewletCommand('EditorText', EditorCommandDeleteAllRight.editorDeleteAllRight))
}
