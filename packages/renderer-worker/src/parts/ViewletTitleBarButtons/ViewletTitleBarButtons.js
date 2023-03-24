import * as TitleBarButtons from '../TitleBarButtons/TitleBarButtons.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    buttons: [],
    x,
    y,
    width,
    height,
  }
}

export const loadContent = async (state) => {
  const buttons = TitleBarButtons.get()
  return {
    ...state,
    buttons,
  }
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}
