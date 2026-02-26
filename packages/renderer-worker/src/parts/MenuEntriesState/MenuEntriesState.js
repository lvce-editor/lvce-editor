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
  // TODO store menu entries here or in file search worker?
  // Usually don't want to start worker for the menu entries
  // But also quickpick menu entries would be better stored there
  await QuickPickWorker.invoke('QuickPick.addMenuEntries', menuEntries)
}
