import { closeEditor } from './ViewletMainCloseEditor.js'

export const closeActiveEditor = (state) => {
  const { editors, activeIndex } = state
  if (activeIndex === -1) {
    return state
  }
  return closeEditor(state, activeIndex)
}
