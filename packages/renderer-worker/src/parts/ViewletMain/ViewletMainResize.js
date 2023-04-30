import * as Assert from '../Assert/Assert.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const resize = (state, dimensions) => {
  const { editors, tabsUid, activeIndex, tabHeight } = state
  const x = dimensions.x
  const contentY = dimensions.y + tabHeight
  const width = dimensions.width
  const contentHeight = dimensions.height - tabHeight
  const childDimensions = {
    x,
    y: contentY,
    width,
    height: contentHeight,
  }
  const editor = editors[activeIndex]
  const commands = []
  if (editor) {
    const editorUid = editor.uid
    Assert.number(editorUid)
    const resizeCommands = Viewlet.resize(editorUid, childDimensions)
    commands.push(...resizeCommands)
    commands.push(['Viewlet.setBounds', editorUid, dimensions.x, tabHeight, dimensions.width, contentHeight])
  }
  if (tabsUid !== -1) {
    commands.push(['Viewlet.setBounds', tabsUid, dimensions.x, 0, dimensions.width, tabHeight])
  }
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands,
  }
}
