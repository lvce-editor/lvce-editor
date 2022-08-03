import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandDeleteWordPartRight from './EditorCommandDeleteWordPartRight.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.deleteWordPartRight', Viewlet.wrapViewletCommand('EditorText', EditorCommandDeleteWordPartRight.editorDeleteWordPartRight))
}
