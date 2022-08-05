import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSetDecorations from './EditorCommandSetDecorations.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.setDecorations', Viewlet.wrapViewletCommand('EditorText', EditorCommandSetDecorations.setDecorations))
}
