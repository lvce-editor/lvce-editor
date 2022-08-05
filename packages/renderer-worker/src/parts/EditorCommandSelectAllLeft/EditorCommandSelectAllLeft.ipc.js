import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectAllLeft from './EditorCommandSelectAllLeft.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.selectAllLeft', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectAllLeft.editorSelectAllLeft))
}
