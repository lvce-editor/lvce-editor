import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectHorizontalRight from './EditorCommandSelectHorizontalRight.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.selectHorizontalRight', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectHorizontalRight.editorSelectHorizontalRight))
}
