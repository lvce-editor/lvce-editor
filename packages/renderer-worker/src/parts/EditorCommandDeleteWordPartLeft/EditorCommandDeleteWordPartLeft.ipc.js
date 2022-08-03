import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandDeleteWordPartLeft from './EditorCommandDeleteWordPartLeft.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.deleteWordPartLeft', Viewlet.wrapViewletCommand('EditorText', EditorCommandDeleteWordPartLeft.editorDeleteWordPartLeft))
}
