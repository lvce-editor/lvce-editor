import { focusIndex } from './ViewletMainFocusIndex.js'

export const focusLast = (state) => {
  const { editors } = state
  return focusIndex(state, editors.length - 1)
}
