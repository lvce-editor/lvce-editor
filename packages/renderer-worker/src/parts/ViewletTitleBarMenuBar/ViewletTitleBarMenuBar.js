import * as TitleBarMenuBarEntries from '../TitleBarMenuBarEntries/TitleBarMenuBarEntries.js'

export const name = 'TitleBarMenuBar'

export const create = () => {
  return {
    titleBarEntries: [],
  }
}

export const loadContent = async (state) => {
  const titleBarEntries = await TitleBarMenuBarEntries.getEntries()
  return {
    ...state,
    titleBarEntries,
  }
}

const renderTitleBarEntries = {
  isEqual(oldState, newState) {
    return oldState.titleBarEntries === newState.titleBarEntries
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'TitleBarMenuBar',
      /* method */ 'setEntries',
      /* titleBarEntries */ newState.titleBarEntries,
    ]
  },
}

export const render = [renderTitleBarEntries]
