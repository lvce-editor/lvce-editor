import * as TitleBarMenuBar from '../TitleBarMenuBar/TitleBarMenuBar.js'
import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'

export const name = 'TitleBar'

const TITLE_BAR_BUTTON_WIDTH = 46

export const create = (id, uri, top, left, width, height) => {
  return {
    disposed: false,
    titleBarEntries: [],
    titleBarButtons: [],
    top,
    left,
    width,
    height,
  }
}

const getTitleBarButtonsWeb = () => {
  return []
}

const getTitleBarButtonsRemote = () => {
  return []
}

const getTitleBarButtonsElectron = () => {
  if (Preferences.get('window.titleBarStyle') === 'custom') {
    return [
      { label: 'Minimize', icon: 'Minimize', id: 'Minimize' },
      { label: 'Maximize', icon: 'Maximize', id: 'Maximize' },
      { label: 'Close', icon: 'Close', id: 'Close' },
    ]
  }
  return []
}

const getTitleBarButtons = () => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return getTitleBarButtonsElectron()
    case PlatformType.Web:
      return getTitleBarButtonsWeb()
    case PlatformType.Remote:
      return getTitleBarButtonsRemote()
  }
}

export const loadContent = async (state) => {
  const titleBarEntries = await TitleBarMenuBar.getEntries()
  const titleBarButtons = getTitleBarButtons()
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

export const handleTitleBarClickMinimize = async (state) => {
  await Command.execute('ElectronWindow.minimize')
  return state
}

export const handleTitleBarClickClose = async (state) => {
  await Command.execute('ElectronWindow.close')
  return state
}

export const handleTitleBarClickToggleMaximize = async (state) => {
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
