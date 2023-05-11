import * as Assert from '../Assert/Assert.js'

export const handleTabsPointerOver = (state, index) => {
  Assert.number(index)
  const { groups, activeGroupIndex } = state
  const group = groups[activeGroupIndex]
  const { editors } = group
  const editor = editors[index]
  if (editor.hovered) {
    return state
  }
  const newEditor = {
    ...editor,
    hovered: true,
  }
  const newEditors = [...editors.slice(0, index), newEditor, ...editors.slice(index + 1)]
  const newGroup = {
    ...group,
    editors: newEditors,
  }
  const newGroups = [...groups.slice(0, activeGroupIndex), newGroup, ...groups.slice(activeGroupIndex + 1)]
  return {
    ...state,
    groups: newGroups,
  }
}
