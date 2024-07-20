import * as VirtualList from '../VirtualList/VirtualList.ipc.js'
import * as ViewletEditorCompletion from './ViewletEditorCompletion.ts'

// prettier-ignore
export const Commands = {
  // 'EditorCompletion.selectCurrent': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectCurrent),
  dispose: ViewletEditorCompletion.dispose,
  handleEditorType: ViewletEditorCompletion.handleEditorType,
  handleEditorDeleteLeft: ViewletEditorCompletion.handleEditorDeleteLeft,
  handleEditorClick: ViewletEditorCompletion.handleEditorClick
}

// prettier-ignore
export const LazyCommands = {
  selectIndex: () => import('./ViewletEditorCompletionSelectIndex.ts'),
  selectCurrent: () => import('./ViewletEditorCompletionSelectCurrent.ts'),
  ...VirtualList.LazyCommands
}
