import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandIndentSelection from './EditorCommandIndentSelection.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.indentSelection', Viewlet.wrapViewletCommand('EditorText', EditorCommandIndentSelection.editorIndentSelection))
}
