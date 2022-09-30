import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletEditorCompletion from './ViewletEditorCompletion.js'

// prettier-ignore
export const Commands = {
  'EditorCompletion.dispose': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.dispose),
  'EditorCompletion.focusFirst': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusFirst),
  'EditorCompletion.focusLast': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusLast),
  'EditorCompletion.focusNext': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusNext),
  'EditorCompletion.focusPrevious': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.focusPrevious),
  'EditorCompletion.handleWheel': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.handleWheel),
  'EditorCompletion.selectCurrent': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectCurrent),
  'EditorCompletion.selectIndex': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectIndex),
}

export * from './ViewletEditorCompletion.js'
