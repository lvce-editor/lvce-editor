import * as ViewletEditorFindWidget from './ViewletEditorFindWidget.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'EditorFindWidget.handleInput': Viewlet.wrapViewletCommand(ViewletEditorFindWidget.name, ViewletEditorFindWidget.handleInput),
  'EditorFindWidget.focusNext': Viewlet.wrapViewletCommand(ViewletEditorFindWidget.name, ViewletEditorFindWidget.focusNext),
  'EditorFindWidget.focusPrevious': Viewlet.wrapViewletCommand(ViewletEditorFindWidget.name, ViewletEditorFindWidget.focusPrevious),
}

export * from './ViewletEditorFindWidget.js'
