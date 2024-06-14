import * as Assert from '../Assert/Assert.ts'
import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import * as Viewlet from '../Viewlet/Viewlet.js'

const getNewGroups = (groups: readonly EditorGroup[], x: number, y: number, width: number, height: number): readonly EditorGroup[] => {
  if (groups.length === 0) {
    return [
      {
        x: x,
        y: y,
        width: width / 2,
        height: height,
        editors: [],
        tabsUid: 0,
      },
      {
        x: x + width / 2,
        y: y,
        width: width / 2,
        height: height,
        editors: [],
        tabsUid: 0,
      },
    ]
  }
  const lastGroup = groups.at(-1)
  if (!lastGroup) {
    throw new Error('missing last group')
  }
  return [
    ...groups.slice(0, -1),
    {
      ...lastGroup,
      x: lastGroup.x,
      y: lastGroup.y,
      width: lastGroup.width / 2,
      height: lastGroup.height,
    },
    {
      x: lastGroup.x + lastGroup.width / 2,
      y: lastGroup.y,
      width: lastGroup.width / 2,
      height: lastGroup.height,
      editors: [],
      tabsUid: 0,
    },
  ]
}

export const splitRight = (state) => {
  const { groups, x, y, width, height, tabHeight } = state
  const newGroups = getNewGroups(groups, x, y, width, height)
  const commands: any[] = []
  const lastGroup = newGroups.at(-2)
  if (!lastGroup) {
    throw new Error('group not found')
  }
  const { activeIndex, editors, tabsUid } = lastGroup
  const editor = editors[activeIndex]
  const dimensions = {
    x: lastGroup.x,
    y: lastGroup.y,
    width: lastGroup.width,
    height: lastGroup.height,
  }
  const contentHeight = height - tabHeight
  if (editor) {
    const editorUid = editor.uid
    Assert.number(editorUid)
    const resizeCommands = Viewlet.resize(editorUid, dimensions)
    commands.push(...resizeCommands)
    commands.push(['Viewlet.setBounds', editorUid, dimensions.x, tabHeight, dimensions.width, contentHeight])
  }
  if (tabsUid !== -1) {
    commands.push(['Viewlet.setBounds', tabsUid, dimensions.x, 0, dimensions.width, tabHeight])
  }
  return {
    newState: {
      ...state,
      groups: newGroups,
    },
    commands,
  }
}
