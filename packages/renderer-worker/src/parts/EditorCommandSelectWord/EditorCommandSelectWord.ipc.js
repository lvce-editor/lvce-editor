import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectWord from './EditorCommandSelectWord.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.selectWord', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectWord.editorSelectWord))
}
