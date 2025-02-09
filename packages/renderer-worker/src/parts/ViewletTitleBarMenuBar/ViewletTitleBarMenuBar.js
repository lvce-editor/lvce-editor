import * as TitleBarMenuBarEntries from '../TitleBarMenuBarEntries/TitleBarMenuBarEntries.js'
import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    titleBarEntries: [],
    focusedIndex: -1,
    isMenuOpen: false,
    menus: [],
    labelFontWeight: 400,
    labelFontSize: 13,
    labelFontFamily: 'system-ui, Ubuntu, Droid Sans, sans-serif',
    labelPadding: 8,
    labelLetterSpacing: 0,
    titleBarHeight: height,
    x,
    y,
    width,
    height,
    commands: [],
  }
}

export const loadContent = async (state) => {
  const titleBarEntries = await TitleBarMenuBarEntries.getEntries()
  await TitleBarWorker.invoke('TitleBarMenuBar.create', state.uid, state.uri, state.x, state.y, state.width, state.height)
  await TitleBarWorker.invoke('TitleBarMenuBar.loadContent', state.uid, titleBarEntries)
  const commands = await TitleBarWorker.invoke('TitleBarMenuBar.render', state.uid)
  return {
    ...state,
    commands,
  }
}

export const hotReload = async (state) => {
  if (state.isHotReloading) {
    return state
  }
  // TODO avoid mutation
  state.isHotReloading = true
  // possible TODO race condition during hot reload
  // there could still be pending promises when the worker is disposed
  const savedState = await TitleBarWorker.invoke('TitleBarMenuBar.saveState', state.uid)

  await TitleBarWorker.restart('TitleBarMenuBar.terminate')

  // TODO run create again

  await TitleBarWorker.invoke('TitleBarMenuBar.loadContent', state.uid, savedState)
  const commands = await TitleBarWorker.invoke('TitleBarMenuBar.render', state.uid)
  state.commands = commands
  state.isHotReloading = false
  return {
    ...state,
  }
}
