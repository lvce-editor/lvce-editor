import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    disposed: false,
    x,
    y,
    width,
    height,
    titleBarIconWidth: 30,
  }
}

export const loadContent = (state) => {
  return state
}

export const getChildren = (state) => {
  const children = []
  const { x, y, width, height, titleBarIconWidth } = state
  let menuBarX = x
  if (true) {
    children.push({
      id: ViewletModuleId.TitleBarIcon,
    })
    menuBarX += titleBarIconWidth
  }
  if (true) {
    children.push({
      id: ViewletModuleId.TitleBarMenuBar,
      x: menuBarX,
      y,
      height,
    })
  }
  if (true) {
    children.push({
      id: ViewletModuleId.TitleBarButtons,
    })
  }
  return children
}

export const hasFunctionalRender = true

export const render = []

export const hasFunctionalResize = true

export const resize = (state) => {
  return state
}
