import * as Preferences from '../Preferences/Preferences.js'
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
    titleBarTitleEnabled: true,
  }
}

export const loadContent = (state) => {
  const titleBarTitleEnabled = Preferences.get('titleBar.titleEnabled') ?? false
  return {
    ...state,
    isFocused: true,
    titleBarTitleEnabled,
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
  const {
    x,
    y,
    width,
    height,
    titleBarIconWidth,
    titleBarTitleEnabled,
    titleBarIconEnabled,
    titleBarMenuBarEnabled,
    titleBarButtonsEnabled,
    titleBarButtonsWidth,
  } = state
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
      setBounds: false,
    })
  }
  if (titleBarTitleEnabled) {
    children.push({
      id: ViewletModuleId.TitleBarTitle,
    })
  }
  if (titleBarButtonsEnabled) {
    children.push({
      id: ViewletModuleId.TitleBarButtons,
    })
  }
  return children
}
