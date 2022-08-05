import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandHandleWheel from './EditorCommandHandleWheel.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.handleWheel', Viewlet.wrapViewletCommand('EditorText', EditorCommandHandleWheel.editorHandleWheel))
}
