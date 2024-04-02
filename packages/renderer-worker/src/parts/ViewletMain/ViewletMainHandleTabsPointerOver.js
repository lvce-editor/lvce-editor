import * as Assert from '../Assert/Assert.ts'
import * as TabFlags from '../TabFlags/TabFlags.js'
import * as GetTabIndex from '../GetTabIndex/GetTabIndex.js'

export const handleTabsPointerOver = (state, eventX, eventY) => {
  Assert.number(eventX)
  Assert.number(eventY)
  const { groups, activeGroupIndex } = state
  const group = groups[activeGroupIndex]
  const { editors, x, y } = group
  const index = GetTabIndex.getTabIndex(editors, x, eventX)
  if (index === -1) {
    return state
  }
  const editor = editors[index]
  if (editor.flags & TabFlags.Hovered) {
    return state
  }
  const newEditor = {
    ...editor,
    flags: editor.flags | TabFlags.Hovered,
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
