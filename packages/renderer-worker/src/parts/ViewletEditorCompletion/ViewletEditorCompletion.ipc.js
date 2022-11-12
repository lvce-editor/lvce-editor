import * as ViewletEditorCompletion from './ViewletEditorCompletion.js'

export const name = 'EditorCompletion'

// prettier-ignore
export const Commands = {
  // 'EditorCompletion.selectCurrent': Viewlet.wrapViewletCommand('EditorCompletion', ViewletEditorCompletion.selectCurrent),
  dispose:  ViewletEditorCompletion.dispose,
}

export const LazyCommands = {
  focusIndex: () => import('../VirtualList/VirtualListFocusIndex.js'),
  focusFirst: () => import('../VirtualList/VirtualListFocusFirst.js'),
  focusLast: () => import('../VirtualList/VirtualListFocusLast.js'),
  focusNext: () => import('../VirtualList/VirtualListFocusNext.js'),
  focusPrevious: () => import('../VirtualList/VirtualListFocusPrevious.js'),
  handleWheel: () => import('../VirtualList/VirtualList.js'),
  selectIndex: () => import('./ViewletEditorCompletionSelectIndex.js'),
}

export const Css = '/css/parts/ViewletEditorCompletion.css'

export * from './ViewletEditorCompletion.js'
