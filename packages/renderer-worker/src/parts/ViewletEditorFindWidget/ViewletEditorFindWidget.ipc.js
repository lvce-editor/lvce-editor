import * as ViewletEditorFindWidget from './ViewletEditorFindWidget.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'EditorFindWidget.handleInput': Viewlet.wrapViewletCommand('EditorFind', ViewletEditorFindWidget.handleInput),
}

export * from './ViewletEditorFindWidget.js'
