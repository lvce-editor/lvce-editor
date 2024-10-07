import * as VirtualList from '../VirtualList/VirtualList.ipc.js'
import * as ViewletEditorCompletion from './ViewletEditorCompletion.ts'

export const Commands = {
  dispose: ViewletEditorCompletion.dispose,
  handleEditorType: ViewletEditorCompletion.handleEditorType,
  handleEditorDeleteLeft: ViewletEditorCompletion.handleEditorDeleteLeft,
  handleEditorClick: ViewletEditorCompletion.handleEditorClick,
}

export const LazyCommands = {
  selectIndex: () => import('./ViewletEditorCompletionSelectIndex.ts'),
  selectCurrent: () => import('./ViewletEditorCompletionSelectCurrent.ts'),
  ...VirtualList.LazyCommands,
}
