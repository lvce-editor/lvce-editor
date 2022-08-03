import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandDeleteWordRight from './EditorCommandDeleteWordRight.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.deleteWordRight', Viewlet.wrapViewletCommand('EditorText', EditorCommandDeleteWordRight.editorDeleteWordRight))
}
