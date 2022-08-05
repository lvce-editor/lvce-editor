import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandSetLanguageId from './EditorCommandSetLanguageId.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.setLanguageId', Viewlet.wrapViewletCommand('EditorText', EditorCommandSetLanguageId.setLanguageId))
}
