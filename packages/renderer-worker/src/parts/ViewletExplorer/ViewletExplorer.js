import * as Assert from '../Assert/Assert.ts'
import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'
import * as Platform from '../Platform/Platform.js'
import * as AssetDir from '../AssetDir/AssetDir.js'
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
    x,
    y,
    width,
    height,
    platform: Platform.getPlatform(),
    assetDir: AssetDir.assetDir,
  }
}

export const loadContent = async (state, savedState) => {
  await ExplorerViewWorker.invoke(
    'Explorer.create',
    state.uid,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    null,
    state.parentUid,
    state.platform,
    state.assetDir,
  )
  await ExplorerViewWorker.invoke('Explorer.loadContent', state.uid, savedState)
  const diffResult = await ExplorerViewWorker.invoke('Explorer.diff2', state.uid)
  const commands = await ExplorerViewWorker.invoke('Explorer.render2', state.uid, diffResult)
  const actionsDom = await ExplorerViewWorker.invoke('Explorer.renderActions2', state.uid)
  return {
    ...state,
    commands,
    actionsDom,
  }
}

export const dispose = (state) => {}

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

export const getMouseActions = async () => {
  try {
    return await ExplorerViewWorker.invoke('Explorer.getMouseActions')
  } catch {
    return []
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
  await ExplorerViewWorker.invoke(
    'Explorer.create',
    state.uid,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    null,
    state.parentUid,
    state.platform,
    state.assetDir,
  )
  await ExplorerViewWorker.invoke('Explorer.loadContent', state.uid, savedState)
  const diffResult = await ExplorerViewWorker.invoke('Explorer.diff2', state.uid)
  const commands = await ExplorerViewWorker.invoke('Explorer.render2', state.uid, diffResult)
  return {
    ...oldState,
    commands,
    isHotReloading: false,
  }
}
