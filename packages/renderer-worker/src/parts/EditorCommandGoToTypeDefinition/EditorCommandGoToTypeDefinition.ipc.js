import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandGoToTypeDefinition from './EditorCommandGoToTypeDefinition.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.goToTypeDefinition', Viewlet.wrapViewletCommand('EditorText', EditorCommandGoToTypeDefinition.editorGoToTypeDefinition))
}
