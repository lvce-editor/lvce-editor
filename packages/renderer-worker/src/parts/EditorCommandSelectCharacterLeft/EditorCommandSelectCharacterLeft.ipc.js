import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectCharacterLeft from './EditorCommandSelectCharacterLeft.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.selectCharacterLeft', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectCharacterLeft.editorSelectCharacterLeft))
}
