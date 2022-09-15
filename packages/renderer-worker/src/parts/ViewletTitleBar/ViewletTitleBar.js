import * as TitleBarMenuBar from '../TitleBarMenuBar/TitleBarMenuBar.js'

export const name = 'TitleBar'

export const create = () => {
  return {
    disposed: false,
    titleBarEntries: [],
    titleBarButtons: [],
  }
}

export const loadContent = async (state) => {
  const titleBarEntries = await TitleBarMenuBar.getEntries()
  const titleBarButtons = [
    { label: 'Minimize', icon: 'Minimize' },
    { label: 'Maximize', icon: 'Maximize' },
    { label: 'Close', icon: 'Close' },
  ]
  return {
    ...state,
    titleBarEntries,
    titleBarButtons,
  }
}

export const contentLoaded = (state) => {}

export const focus = async () => {
  await TitleBarMenuBar.focus()
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

const renderTitleBarEntries = {
  isEqual(oldState, newState) {
    return oldState.titleBarEntries === newState.titleBarEntries
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'TitleBar',
      /* method */ 'menuSetEntries',
      /* titleBarEntries */ newState.titleBarEntries,
    ]
  },
}

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

export const render = [renderTitleBarEntries, renderTitleBarButtons]
