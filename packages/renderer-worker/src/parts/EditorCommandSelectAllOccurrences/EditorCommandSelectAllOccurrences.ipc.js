import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSelectAllOccurrences from './EditorCommandSelectAllOccurrences.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.selectAllOccurrences', Viewlet.wrapViewletCommand('EditorText', EditorCommandSelectAllOccurrences.editorSelectAllOccurrences))
}
