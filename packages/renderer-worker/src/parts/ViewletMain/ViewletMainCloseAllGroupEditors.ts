import * as Viewlet from '../Viewlet/Viewlet.js'
import type { MainState } from './ViewletMainTypes.ts'

const getUid = (editor) => {
  return editor.uid
}

const getEditors = (group) => {
  return group.editors
}

const getResizeCommands = async (groups, width, tabHeight, y): Promise<readonly any[]> => {
  if (groups.length === 0) {
    return []
  }
  const splitWidth = width / groups.length
  const allCommands: any[] = []
  for (const group of groups) {
    const { editors } = group
    if (editors.length > 0) {
      const editor = editors[0]
      const resizeCommands = await Viewlet.resize(editor.uid, {
        x: group.x,
        y: y + group.y + tabHeight,
        width: splitWidth,
        height: group.height - tabHeight,
      })
      allCommands.push(...resizeCommands)
    }
  }
  return allCommands
}

export const closeGroupAllEditors = async (state: MainState, groupIndex: number) => {
  // @ts-ignore
  const { groups, uid, width, tabHeight, y } = state
  const group = groups[groupIndex]
  const editors = getEditors(group)
  const ids = editors.map(getUid)
  const disposeGroupCommands = [['Viewlet.send', uid, 'dispose'], ...ids.flatMap(Viewlet.disposeFunctional)]
  const newGroups = [...groups.slice(0, groupIndex), ...groups.slice(groupIndex + 1)]
  const resizeOtherGroupsCommands = await getResizeCommands(newGroups, width, tabHeight, y)
  const commands = [...disposeGroupCommands, ...resizeOtherGroupsCommands]

  return {
    newState: {
      ...state,
      groups: newGroups,
      activeGroupIndex: -1,
    },
    commands,
  }
}
