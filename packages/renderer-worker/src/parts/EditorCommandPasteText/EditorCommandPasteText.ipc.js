import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandPasteText from './EditorCommandPasteText.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.pasteText', Viewlet.wrapViewletCommand('EditorText', EditorCommandPasteText.editorPasteText))
}
