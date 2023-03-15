import * as ViewletEditorCompletionSelectIndex from './ViewletEditorCompletionSelectIndex.js'

export const selectCurrent = (state) => {
  const { focusedIndex } = state
  return ViewletEditorCompletionSelectIndex.selectIndex(state, focusedIndex)
}
