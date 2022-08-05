import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectNextOccurrence from './EditorCommandSelectNextOccurrence.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.SelectNextOccurrence', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectNextOccurrence.editorSelectNextOccurrence))
}
