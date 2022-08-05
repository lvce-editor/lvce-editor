import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectPreviousOccurrence from './EditorCommandSelectPreviousOccurrence.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.SelectPreviousOccurrence', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectPreviousOccurrence.editorSelectPreviousOccurrence))
}
