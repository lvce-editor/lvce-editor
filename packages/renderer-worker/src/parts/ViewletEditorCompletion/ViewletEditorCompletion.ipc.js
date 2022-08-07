import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletEditorCompletion from './ViewletEditorCompletion.js'

// prettier-ignore
export const Commands = {
  'EditorCompletion.dispose': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.dispose),
  'EditorCompletion.selectIndex': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectIndex),
  'EditorCompletion.focusFirst': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusFirst),
  'EditorCompletion.focusLast': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusLast),
  'EditorCompletion.focusNext': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusNext),
  'EditorCompletion.focusPrevious': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusPrevious),
  'EditorCompletion.selectCurrent': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectCurrent),
}

export const Css = '/css/parts/EditorCompletion.css'

export * from './ViewletEditorCompletion.js'
