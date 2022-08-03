import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandFormat from './EditorCommandFormat.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.format', Viewlet.wrapViewletCommand('EditorText', EditorCommandFormat.editorFormat))
}
