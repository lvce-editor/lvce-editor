import * as Assert from '../Assert/Assert.js'
import * as TabFlags from '../TabFlags/TabFlags.js'

export const handleTabsPointerOut = (state, oldIndex, newIndex) => {
  Assert.number(oldIndex)
  Assert.number(newIndex)
  if (oldIndex === newIndex) {
    return state
  }
  const { groups, activeGroupIndex } = state
  const group = groups[activeGroupIndex]
  const { editors } = group
  const editor = editors[oldIndex]
  if (editor.flags & ~TabFlags.Hovered) {
    return state
  }
  const newEditor = {
    ...editor,
    flags: editor.flags & ~TabFlags.Hovered,
  }
  const newEditors = [...editors.slice(0, oldIndex), newEditor, ...editors.slice(oldIndex + 1)]
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
