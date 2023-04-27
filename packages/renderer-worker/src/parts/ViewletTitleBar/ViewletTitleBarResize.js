import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

const getTitleBarMenuBarWidth = (width, menuBarX, titleBarButtonsWidth) => {
  const remainingWidth = width - menuBarX - titleBarButtonsWidth
  return remainingWidth
}

export const resize = (state, dimensions) => {
  const titleBarMenuBarState = ViewletStates.getState(ViewletModuleId.TitleBarMenuBar)
  const commands = []
  const { titleBarIconWidth, titleBarButtonsWidth } = state
  const menuBarX = dimensions.x + titleBarIconWidth
  const menuBarY = dimensions.y
  const menuBarWidth = getTitleBarMenuBarWidth(dimensions.width, menuBarX, titleBarButtonsWidth)
  const menuBarHeight = dimensions.height
  commands.push(
    ...Viewlet.resize(titleBarMenuBarState.uid, {
      x: menuBarX,
      y: menuBarY,
      width: menuBarWidth,
      height: menuBarHeight,
    })
  )
  return {
    newState: state,
    commands,
  }
}
