import * as TitleBarMenuBar from '../TitleBarMenuBar/TitleBarMenuBar.js'

export const name = 'TitleBar'

export const create = () => {
  return {
    disposed: false,
    titleBarEntries: [],
  }
}

export const loadContent = async (state) => {
  const titleBarEntries = await TitleBarMenuBar.getEntries()
  return {
    ...state,
    titleBarEntries,
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

export const render = [renderTitleBarEntries]
