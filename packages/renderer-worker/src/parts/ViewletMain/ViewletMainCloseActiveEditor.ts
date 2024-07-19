import { closeEditor } from './ViewletMainCloseEditor.js'
import type { MainState } from './ViewletMainTypes.ts'

export const closeActiveEditor = (state: MainState) => {
  const { groups, activeGroupIndex } = state
  if (activeGroupIndex === -1) {
    return state
  }
  const group = groups[activeGroupIndex]
  const { activeIndex } = group
  return closeEditor(state, activeIndex)
}

export const closeFocusedTab = closeActiveEditor
