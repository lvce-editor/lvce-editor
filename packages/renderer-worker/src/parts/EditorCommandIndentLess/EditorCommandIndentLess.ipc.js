import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandIndentLess from './EditorCommandIndentLess.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.IndentLess', Viewlet.wrapViewletCommand('EditorText', EditorCommandIndentLess.editorIndentLess))
}
