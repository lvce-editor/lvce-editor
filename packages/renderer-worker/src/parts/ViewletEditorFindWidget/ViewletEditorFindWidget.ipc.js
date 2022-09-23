import * as ViewletEditorFindWidget from './ViewletEditorFindWidget.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'EditorFindWidget.handleInput': Viewlet.wrapViewletCommand('EditorFindWidget', ViewletEditorFindWidget.handleInput),
  'EditorFindWidget.focusNext': Viewlet.wrapViewletCommand('EditorFindWidget', ViewletEditorFindWidget.focusNext),
}

export * from './ViewletEditorFindWidget.js'
