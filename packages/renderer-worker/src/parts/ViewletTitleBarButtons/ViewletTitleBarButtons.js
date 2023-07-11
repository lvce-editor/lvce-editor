import * as TitleBarButtons from '../TitleBarButtons/TitleBarButtons.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    buttons: [],
    x,
    y,
    width,
    height,
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

const setButton = (state, button) => {
  const { buttons } = state
  const newButtons = [buttons[0], { ...buttons[1], icon: button, id: button }, buttons[2]]
  return {
    ...state,
    buttons: newButtons,
  }
}

export const handleWindowDidUnmaximize = (state) => {
  return setButton(state, 'Maximize')
}

export const handleWindowDidMaximize = (state) => {
  return setButton(state, 'Restore')
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}
