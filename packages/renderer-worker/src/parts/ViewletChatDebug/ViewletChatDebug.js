import * as ChatDebugViewWorker from '../ChatDebugViewWorker/ChatDebugViewWorker.js'
import * as Platform from '../Platform/Platform.js'
import * as AssetDir from '../AssetDir/AssetDir.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    x,
    y,
    width,
    height,
    commands: [],
    platform: Platform.getPlatform(),
    assetDir: AssetDir.assetDir,
    uri,
  }
}

export const loadContent = async (state) => {
  const savedState = {}
  await ChatDebugViewWorker.invoke(
    'ChatDebug.create',
    state.uid,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    state.platform,
    state.assetDir,
  )
  await ChatDebugViewWorker.invoke('ChatDebug.loadContent', state.uid, savedState)
  const diffResult = await ChatDebugViewWorker.invoke('ChatDebug.diff2', state.uid)
  const commands = await ChatDebugViewWorker.invoke('ChatDebug.render2', state.uid, diffResult)
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
  const savedState = await ChatDebugViewWorker.invoke('ChatDebug.saveState', state.uid)
  await ChatDebugViewWorker.restart('ChatDebug.terminate')
  await ChatDebugViewWorker.invoke('ChatDebug.create', state.uid, state.uri, state.x, state.y, state.width, state.height, null)
  await ChatDebugViewWorker.invoke('ChatDebug.loadContent', state.uid, savedState)
  const diffResult = await ChatDebugViewWorker.invoke('ChatDebug.diff2', state.uid)
  const commands = await ChatDebugViewWorker.invoke('ChatDebug.render2', state.uid, diffResult)
  state.isHotReloading = false
  return {
    ...state,
    commands,
  }
}
