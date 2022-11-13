import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = (id, uri, top, left, width, height) => {
  return {
    disposed: false,
    top,
    left,
    width,
    height,
  }
}

export const loadContent = (state) => {
  return state
}

export const getChildren = (state) => {
  const children = []
  if (true) {
    children.push({
      id: ViewletModuleId.TitleBarMenuBar,
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
