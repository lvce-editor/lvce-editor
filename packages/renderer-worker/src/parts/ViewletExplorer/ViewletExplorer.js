import * as Assert from '../Assert/Assert.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.js'
import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'
import * as Height from '../Height/Height.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
// TODO viewlet should only have create and refresh functions
// every thing else can be in a separate module <viewlet>.lazy.js
// and  <viewlet>.ipc.js

// viewlet: creating | refreshing | done | disposed
// TODO recycle viewlets (maybe)

// TODO instead of root string, there should be a root dirent

export const create = (id, uri, x, y, width, height, args, parentUid) => {
  Assert.number(id)
  return {
    uid: id,
    parentUid,
    root: '',
    items: [],
    focusedIndex: -1,
    focused: false,
    hoverIndex: -1,
    x,
    y,
    width,
    height,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 0,
    pathSeparator: PathSeparatorType.Slash,
    version: 0,
    editingIndex: -1,
    itemHeight: Height.ListItem,
    dropTargets: [],
    excluded: [],
    editingValue: '',
    editingType: ExplorerEditingType.None,
    editingIcon: '',
  }
}

export const loadContent = async (state, savedState) => {
  await ExplorerViewWorker.invoke('Explorer.create', state.uid, state.uri, state.x, state.y, state.width, state.height, null, state.parentUid)
  await ExplorerViewWorker.invoke('Explorer.loadContent', state.uid, savedState)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', state.uid)
  return {
    ...state,
    commands,
  }
}

const cancelRequest = (state) => {}

export const dispose = (state) => {
  if (!state.pendingRequests) {
    return
  }
  for (const request of state.pendingRequests) {
    cancelRequest(request)
  }
  state.pendingRequests = []
  // if (state.lastFocusedWidget === context) {
  //   state.lastFocusedWidget = undefined
  // }
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  const { minLineY, itemHeight } = state
  const maxLineY = minLineY + Math.round(dimensions.height / itemHeight)
  return {
    ...state,
    ...dimensions,
    maxLineY,
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
  const savedState = await ExplorerViewWorker.invoke('Explorer.saveState', state.uid)
  await ExplorerViewWorker.restart('Explorer.terminate')
  const oldState = {
    ...state,
    items: [],
  }
  await ExplorerViewWorker.invoke('Explorer.loadContent', state.uid, savedState)
  const commands = await ExplorerViewWorker.invoke('Explorer.render', oldState.uid)
  return {
    ...oldState,
    commands,
    isHotReloading: false,
  }
}
