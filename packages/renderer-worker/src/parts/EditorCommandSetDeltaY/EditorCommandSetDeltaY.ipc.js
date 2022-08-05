import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSetDeltaY from './EditorCommandSetDeltaY.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.setDeltaY', Viewlet.wrapViewletCommand('EditorText', EditorCommandSetDeltaY.editorSetDeltaY))
}
