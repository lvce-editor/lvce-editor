import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandInsertLineBreak from './EditorCommandInsertLineBreak.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.insertLineBreak', Viewlet.wrapViewletCommand('EditorText', EditorCommandInsertLineBreak.editorInsertLineBreak))
}
