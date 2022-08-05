import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectWordRight from './EditorCommandSelectWordRight.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.selectWordRight', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectWordRight.editorSelectWordRight))
}
