import * as Command from '../Command/Command.js'
import * as TitleBarButtons from '../TitleBarButtons/TitleBarButtons.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const name = ViewletModuleId.TitleBarButtons

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

export const handleClickMinimize = async (state) => {
  await Command.execute('ElectronWindow.minimize')
  return state
}

export const handleClickClose = async (state) => {
  await Command.execute('ElectronWindow.close')
  return state
}

export const handleClickToggleMaximize = async (state) => {
  // TODO need command for toggleMaximize
  await Command.execute('ElectronWindow.maximize')
  return state
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
      /* id */ 'TitleBar',
      /* method */ 'setButtons',
      /* titleBarEntries */ newState.titleBarButtons,
    ]
  },
}

export const render = [renderTitleBarButtons]
