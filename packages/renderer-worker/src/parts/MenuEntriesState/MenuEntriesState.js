import * as QuickPickWorker from '../QuickPickWorker/QuickPickWorker.js'

export const state = {
  /**
   * @type {any[]}
   */
  menuEntries: [],
}

export const getAll = () => {
  return state.menuEntries
}

export const add = async (menuEntries) => {
  state.menuEntries = [...state.menuEntries, ...menuEntries]
  if (QuickPickWorker.isCreated()) {
    await QuickPickWorker.invoke('QuickPick.addMenuEntries', menuEntries)
  }
}
