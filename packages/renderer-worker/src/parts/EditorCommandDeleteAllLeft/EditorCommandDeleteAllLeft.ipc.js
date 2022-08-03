import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandDeleteAllLeft from './EditorCommandDeleteAllLeft.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.deleteAllLeft', Viewlet.wrapViewletCommand('EditorText', EditorCommandDeleteAllLeft.editorDeleteAllLeft))
}
