import * as PanelWorker from '../PanelWorker/PanelWorker.js'
import * as Height from '../Height/Height.js'

// TODO rename viewlet parameter to something else (e.g. clicking settings opens context menu not settings viewlet)
// TODO should just pass index
// then if item is viewlet -> open viewlet
// else if item is settings -> open settings

// TODO this should be create
// TODO unregister listeners when hidden

export const create = (id, uri, x, y, width, height): any => {
  return {
    uid: id,
    PanelItems: [],
    filteredItems: [],
    focusedIndex: -1,
    selectedIndex: -1,
    focused: false,
    x,
    y,
    width,
    height,
    commands: [],
  }
}

export const loadContent = async (state: any): Promise<any> => {
  const savedState = {}
  await PanelWorker.invoke('Panel.create', state.uid, '', state.x, state.y, state.width, state.height, null)
  await PanelWorker.invoke('Panel.loadContent', state.uid, savedState)
  const diffResult = await PanelWorker.invoke('Panel.diff2', state.uid)
  const commands = await PanelWorker.invoke('Panel.render2', state.uid, diffResult)
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
  const savedState = await PanelWorker.invoke('Panel.saveState', state.uid)
  await PanelWorker.restart('Panel.terminate')
  await PanelWorker.invoke('Panel.create', state.uid, '', state.x, state.y, state.width, state.height, null)
  await PanelWorker.invoke('Panel.loadContent', state.uid, savedState)
  const diffResult = await PanelWorker.invoke('Panel.diff2', state.uid)
  const commands = await PanelWorker.invoke('Panel.render2', state.uid, diffResult)
  state.isHotReloading = false
  return {
    ...state,
    commands,
  }
}
