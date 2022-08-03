import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorCommandComposition from './EditorCommandComposition.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Editor.compositionStart', Viewlet.wrapViewletCommand('EditorText', EditorCommandComposition.editorCompositionStart))
  Command.register('Editor.compositionUpdate', Viewlet.wrapViewletCommand('EditorText', EditorCommandComposition.editorCompositionUpdate))
  Command.register('Editor.compositionEnd', Viewlet.wrapViewletCommand('EditorText', EditorCommandComposition.editorCompositionEnd))

}
