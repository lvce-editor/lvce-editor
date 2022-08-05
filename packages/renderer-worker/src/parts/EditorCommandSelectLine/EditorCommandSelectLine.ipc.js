import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectLine from './EditorCommandSelectLine.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.selectLine', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectLine.editorSelectLine))
}
