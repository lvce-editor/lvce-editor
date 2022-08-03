import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCompletion from './EditorCommandCompletion.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.openCompletion', Viewlet.wrapViewletCommand('EditorText', EditorCompletion.open))
  Command.register('Editor.openCompletionFromType', Viewlet.wrapViewletCommand('EditorText', EditorCompletion.openFromType))

}
