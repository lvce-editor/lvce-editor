import * as ViewletEditorCompletion from './ViewletEditorCompletion.js'
import * as VirtualList from '../VirtualList/VirtualList.ipc.js'

// prettier-ignore
export const Commands = {
  // 'EditorCompletion.selectCurrent': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectCurrent),
  dispose:  ViewletEditorCompletion.dispose,
  handleEditorType: ViewletEditorCompletion.handleEditorType,
  handleEditorDeleteCharacterLeft: ViewletEditorCompletion.handleEditorDeleteCharacterLeft,
  handleEditorClick: ViewletEditorCompletion.handleEditorClick
}

// prettier-ignore
export const LazyCommands = {
  selectIndex: () => import('./ViewletEditorCompletionSelectIndex.js'),
  selectCurrent: () => import('./ViewletEditorCompletionSelectCurrent.js'),
  ...VirtualList.LazyCommands
}
