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
  const { top, left, width, height } = state
  if (true) {
    children.push({
      id: ViewletModuleId.TitleBarMenuBar,
      top,
      height,
      left,
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
