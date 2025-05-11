import * as Viewlet from '../Viewlet/Viewlet.js'
import type { MainState } from './ViewletMainTypes.ts'

const getUid = (editor) => {
  return editor.uid
}

const getEditors = (group) => {
  return group.editors
}

export const closeGroupAllEditors = (state: MainState, groupIndex: number) => {
  // @ts-ignore
  const { groups, uid } = state
  const group = groups[groupIndex]
  const editors = getEditors(group)
  const ids = editors.map(getUid)
  const commands = [['Viewlet.send', uid, 'dispose'], ...ids.flatMap(Viewlet.disposeFunctional)]
  const newGroups = [...groups.slice(0, groupIndex), ...groups.slice(groupIndex + 1)]
  return {
    newState: {
      ...state,
      groups: newGroups,
      activeGroupIndex: -1,
    },
    commands,
  }
}
