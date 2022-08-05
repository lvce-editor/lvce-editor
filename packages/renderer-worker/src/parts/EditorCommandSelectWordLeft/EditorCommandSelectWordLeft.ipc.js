import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectWordLeft from './EditorCommandSelectWordLeft.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.selectWordLeft', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectWordLeft.editorSelectWordLeft))
}
