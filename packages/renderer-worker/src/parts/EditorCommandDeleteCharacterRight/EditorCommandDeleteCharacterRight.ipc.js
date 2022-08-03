import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandDeleteCharacterRight from './EditorCommandDeleteCharacterRight.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.deleteCharacterRight', Viewlet.wrapViewletCommand('EditorText', EditorCommandDeleteCharacterRight.editorDeleteCharacterRight))
}
