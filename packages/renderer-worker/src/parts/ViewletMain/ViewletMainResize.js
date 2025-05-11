import * as Assert from '../Assert/Assert.ts'
import * as Viewlet from '../Viewlet/Viewlet.js'

const resizeGroups = (groups, dimensions) => {
  const newGroups = []
  const width = dimensions.width
  const groupWidth = width / groups.length
  let currentX = 0
  for (const group of groups) {
    newGroups.push({
      ...group,
      x: currentX,
      y: group.y,
      width: groupWidth,
      height: group.height,
    })
    currentX += groupWidth
  }
  return newGroups
}

export const resize = async (state, dimensions) => {
  const { groups, tabHeight } = state
  const width = dimensions.width
  const contentHeight = dimensions.height - tabHeight

  const commands = []
  const groupWidth = width / groups.length
  const newGroups = resizeGroups(groups, dimensions)
  for (const group of newGroups) {
    const { activeIndex, editors, tabsUid } = group
    const editor = editors[activeIndex] || editors[0]
    if (editor) {
      const editorUid = editor.uid
      Assert.number(editorUid)
      const childDimensions = {
        x: group.x,
        y: group.y,
        width: group.width,
        height: contentHeight,
      }
      const resizeCommands = await Viewlet.resize(editorUid, childDimensions)
      commands.push(...resizeCommands)
      commands.push(['Viewlet.setBounds', editorUid, group.x, tabHeight, groupWidth, contentHeight])
    }
    if (tabsUid !== -1) {
      commands.push(['Viewlet.setBounds', tabsUid, group.x, 0, groupWidth, tabHeight])
    }
  }
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands,
  }
}
