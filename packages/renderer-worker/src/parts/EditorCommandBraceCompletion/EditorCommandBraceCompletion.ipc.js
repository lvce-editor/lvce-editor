import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorBraceCompletion from './EditorCommandBraceCompletion.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.braceCompletion', Viewlet.wrapViewletCommand('EditorText', EditorBraceCompletion.editorBraceCompletion))

}
