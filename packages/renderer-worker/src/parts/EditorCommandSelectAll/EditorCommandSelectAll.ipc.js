import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectAll from './EditorCommandSelectAll.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.selectAll', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectAll.editorSelectAll))
}
