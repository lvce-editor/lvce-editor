import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    disposed: false,
    x,
    y,
    width,
    height,
  }
}

export const loadContent = (state) => {
  return state
}

export const getChildren = (state) => {
  const children = []
  const { x, y, width, height } = state
  if (true) {
    children.push({
      id: ViewletModuleId.TitleBarIcon,
    })
  }
  if (true) {
    children.push({
      id: ViewletModuleId.TitleBarMenuBar,
      x,
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
