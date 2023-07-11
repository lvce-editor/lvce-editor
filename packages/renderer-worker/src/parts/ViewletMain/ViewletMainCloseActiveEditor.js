import { closeEditor } from './ViewletMainCloseEditor.js'

export const closeActiveEditor = (state) => {
  const { groups, activeGroupIndex } = state
  if (activeGroupIndex === -1) {
    return state
  }
  const group = groups[activeGroupIndex]
  const { activeIndex } = group
  return closeEditor(state, activeIndex)
}

export const closeFocusedTab = closeActiveEditor
