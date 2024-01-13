export const state = {
  /**
   * @type {any[]}
   */
  menuEntries: [],
}

export const getAll = () => {
  return state.menuEntries
}

export const add = (menuEntries) => {
  state.menuEntries = [...state.menuEntries, ...menuEntries]
}
