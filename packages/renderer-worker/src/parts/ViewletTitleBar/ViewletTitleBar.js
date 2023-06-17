import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    disposed: false,
    x,
    y,
    width,
    height,
    titleBarIconWidth: 30,
    isFocused: false,
    titleBarIconEnabled: true,
    titleBarMenuBarEnabled: true,
    titleBarButtonsEnabled: true,
    titleBarButtonsWidth: 46 * 3,
  }
}

export const loadContent = (state) => {
  return {
    ...state,
    isFocused: true,
  }
}

export const handleFocusChange = (state, isFocused) => {
  return { ...state, isFocused }
}

const getTitleBarMenuBarWidth = (width, menuBarX, titleBarButtonsWidth) => {
  const remainingWidth = width - menuBarX - titleBarButtonsWidth
  return remainingWidth
}

export const getChildren = (state) => {
  const children = []
  const { x, y, width, height, titleBarIconWidth, titleBarIconEnabled, titleBarMenuBarEnabled, titleBarButtonsEnabled, titleBarButtonsWidth } = state
  let menuBarX = x

  if (titleBarIconEnabled) {
    children.push({
      id: ViewletModuleId.TitleBarIcon,
    })
    menuBarX += titleBarIconWidth
  }
  if (titleBarMenuBarEnabled) {
    const remainingWidth = getTitleBarMenuBarWidth(width, menuBarX, titleBarButtonsWidth)
    children.push({
      id: ViewletModuleId.TitleBarMenuBar,
      x: menuBarX,
      y,
      height,
      width: remainingWidth,
    })
  }
  if (titleBarButtonsEnabled) {
    children.push({
      id: ViewletModuleId.TitleBarButtons,
    })
  }
  return children
}
