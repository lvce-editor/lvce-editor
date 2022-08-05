import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandPaste from './EditorCommandPaste.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.paste', Viewlet.wrapViewletCommand('EditorText', EditorCommandPaste.editorPaste))
}
