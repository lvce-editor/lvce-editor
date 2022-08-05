import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectInsideString from './EditorCommandSelectInsideString.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.selectInsideString', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectInsideString.editorSelectInsideString))
}
