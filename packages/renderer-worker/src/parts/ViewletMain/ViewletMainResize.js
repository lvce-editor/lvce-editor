import * as Assert from '../Assert/Assert.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const resize = (state, dimensions) => {
  const { editors, tabsUid } = state
  const x = dimensions.x
  const contentY = dimensions.y + state.tabHeight
  const width = dimensions.width
  const contentHeight = dimensions.height - state.tabHeight
  const childDimensions = {
    x,
    y: contentY,
    width,
    height: contentHeight,
  }
  const editor = editors[0]
  const commands = []
  if (editor) {
    const editorUid = editor.uid
    Assert.number(editorUid)
    commands.push(...Viewlet.resize(editorUid, childDimensions))
  }
  if (tabsUid !== -1) {
    commands.push(['Viewlet.setBounds', tabsUid, dimensions.x, 0, dimensions.width, dimensions.tabHeight])
  }
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands,
  }
}
