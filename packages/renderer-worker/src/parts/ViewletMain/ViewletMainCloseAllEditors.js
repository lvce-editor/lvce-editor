import * as Viewlet from '../Viewlet/Viewlet.js'

export const closeAllEditors = async (state) => {
  const { editors, selectedIndex } = state
  const ids = editors.map(getId)
  // TODO should call dispose method, but only in renderer-worker
  // TODO avoid side effect here
  for (const id of ids) {
    await ViewletStates.dispose(id)
  }
  // TODO dispose background tabs
  return {
    ...state,
    editors: [],
    focusedIndex: -1,
    selectedIndex: -1,
  }
}
