import * as TitleBarButtons from '../TitleBarButtons/TitleBarButtons.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = (id, uri, top, left, width, height) => {
  return {
    buttons: [],
    top,
    left,
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

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}

export const hasFunctionalRender = true

const renderTitleBarButtons = {
  isEqual(oldState, newState) {
    return oldState.titleBarButtons === newState.titleBarButtons
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.TitleBarButtons,
      /* method */ 'setButtons',
      /* titleBarEntries */ newState.titleBarButtons,
    ]
  },
}

export const render = [renderTitleBarButtons]
