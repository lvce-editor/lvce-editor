import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandDeleteWordLeft from './EditorCommandDeleteWordLeft.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.deleteWordLeft', Viewlet.wrapViewletCommand('EditorText', EditorCommandDeleteWordLeft.editorDeleteWordLeft))
}
