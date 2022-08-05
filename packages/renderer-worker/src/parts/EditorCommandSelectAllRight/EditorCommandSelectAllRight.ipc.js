import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectAllRight from './EditorCommandSelectAllRight.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.selectAllRight', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectAllRight.editorSelectAllRight))
}
