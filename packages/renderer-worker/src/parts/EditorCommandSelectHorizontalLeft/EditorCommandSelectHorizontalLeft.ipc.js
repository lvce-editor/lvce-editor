import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.selectHorizontalLeft', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectHorizontalLeft.editorSelectHorizontalLeft))
}
