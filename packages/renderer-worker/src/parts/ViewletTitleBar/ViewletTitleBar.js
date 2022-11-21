import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = (id, uri, top, left, width, height) => {
  return {
    disposed: false,
    top,
    left,
    width,
    height,
    children: [],
  }
}

export const loadContent = (state) => {
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
  return {
    ...state,
    children,
  }
}

export const hasFunctionalRender = true

export const render = []

export const hasFunctionalResize = true

export const resize = (state) => {
  return state
}
