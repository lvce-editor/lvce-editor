import * as ViewletEditorCompletion from './ViewletEditorCompletion.js'

// prettier-ignore
export const Commands = {
  // 'EditorCompletion.selectCurrent': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectCurrent),
  dispose:  ViewletEditorCompletion.dispose,
  focusFirst: ViewletEditorCompletion.focusFirst,
  focusLast:  ViewletEditorCompletion.focusLast,
  focusNext: ViewletEditorCompletion.focusNext,
  focusPrevious:  ViewletEditorCompletion.focusPrevious,
  handleWheel: ViewletEditorCompletion.handleWheel,
  selectIndex:  ViewletEditorCompletion.selectIndex,
}

export const Css = '/css/parts/ViewletEditorCompletion.css'

export * from './ViewletEditorCompletion.js'
