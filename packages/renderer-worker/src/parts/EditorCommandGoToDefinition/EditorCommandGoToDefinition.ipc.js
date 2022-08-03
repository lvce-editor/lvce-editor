import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandGoToDefinition from './EditorCommandGoToDefinition.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.goToDefinition', Viewlet.wrapViewletCommand('EditorText', EditorCommandGoToDefinition.editorGoToDefinition))
}
