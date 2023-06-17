import * as TitleBarButtons from '../TitleBarButtons/TitleBarButtons.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    buttons: [],
    x,
    y,
    width,
    height,
    isMaximized: false,
    uid: id,
  }
}

export const loadContent = async (state) => {
  const buttons = TitleBarButtons.get()
  return {
    ...state,
    buttons,
  }
}

export const handleWindowDidMinimize = (state) => {
  return state
}

export const handleWindowDidUnmaximize = (state) => {
  return {
    ...state,
    isMaximized: false,
  }
}

export const handleWindowDidMaximize = (state) => {
  return {
    ...state,
    isMaximized: true,
  }
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}
