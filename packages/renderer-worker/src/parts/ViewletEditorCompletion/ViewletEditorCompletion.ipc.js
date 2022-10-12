import * as ViewletEditorCompletion from './ViewletEditorCompletion.js'

// prettier-ignore
export const Commands = {
  'EditorCompletion.dispose':  ViewletEditorCompletion.dispose,
  'EditorCompletion.focusFirst': ViewletEditorCompletion.focusFirst,
  'EditorCompletion.focusLast':  ViewletEditorCompletion.focusLast,
  'EditorCompletion.focusNext': ViewletEditorCompletion.focusNext,
  'EditorCompletion.focusPrevious':  ViewletEditorCompletion.focusPrevious,
  'EditorCompletion.handleWheel': ViewletEditorCompletion.handleWheel,
  'EditorCompletion.selectIndex':  ViewletEditorCompletion.selectIndex,
  // 'EditorCompletion.selectCurrent': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectCurrent),
}

export * from './ViewletEditorCompletion.js'
