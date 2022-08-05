import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandIndentMore from './EditorCommandIndentMore.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.IndentMore', Viewlet.wrapViewletCommand('EditorText', EditorCommandIndentMore.editorIndentMore))
}
