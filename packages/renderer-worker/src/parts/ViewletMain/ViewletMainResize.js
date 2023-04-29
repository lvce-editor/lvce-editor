import * as Assert from '../Assert/Assert.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const resize = (state, dimensions) => {
  const { editors } = state
  const x = dimensions.x
  const y = dimensions.y + state.tabHeight
  const width = dimensions.width
  const contentHeight = dimensions.height - state.tabHeight
  const childDimensions = {
    x,
    y,
    width,
    height: contentHeight,
  }
  const editor = editors[0]
  let commands = []
  // console.log(editor)
  if (editor) {
    const editorUid = editor.uid
    Assert.number(editorUid)
    commands = Viewlet.resize(editorUid, childDimensions)
    commands.push(['Viewlet.setBounds', editorUid, x, state.tabHeight, width, contentHeight])
  }
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands,
  }
}
