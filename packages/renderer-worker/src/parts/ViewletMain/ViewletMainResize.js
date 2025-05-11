import * as Assert from '../Assert/Assert.ts'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const resize = async (state, dimensions) => {
  const { groups, tabHeight } = state
  const x = dimensions.x
  const contentY = dimensions.y + tabHeight
  const width = dimensions.width
  const contentHeight = dimensions.height - tabHeight

  const commands = []
  const groupWidth = width / groups.length
  let currentX = 0
  for (const group of groups) {
    const { activeIndex, editors, tabsUid } = group
    const editor = editors[activeIndex] || editors[0]
    if (editor) {
      const editorUid = editor.uid
      Assert.number(editorUid)
      const childDimensions = {
        x: currentX,
        y: contentY,
        width: groupWidth,
        height: contentHeight,
      }
      const resizeCommands = await Viewlet.resize(editorUid, childDimensions)
      commands.push(...resizeCommands)
      commands.push(['Viewlet.setBounds', editorUid, group.x, tabHeight, groupWidth, contentHeight])
    }
    if (tabsUid !== -1) {
      commands.push(['Viewlet.setBounds', tabsUid, group.x, 0, groupWidth, tabHeight])
    }
    currentX += groupWidth
  }
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands,
  }
}
