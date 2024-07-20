import * as ViewletEditorCompletionSelectIndex from './ViewletEditorCompletionSelectIndex.ts'

export const selectCurrent = (state) => {
  const { focusedIndex } = state
  return ViewletEditorCompletionSelectIndex.selectIndex(state, focusedIndex)
}
