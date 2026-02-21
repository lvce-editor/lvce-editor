import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as Platform from '../Platform/Platform.js'
import * as AssetDir from '../AssetDir/AssetDir.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    uri,
    x,
    y,
    width,
    height,
    commands: [],
    platform: Platform.getPlatform(),
    assetDir: AssetDir.assetDir,
  }
}

export const loadContent = async (state) => {
  const savedState = {}
  await EditorWorker.invoke('Editor.create2', state.uid, state.uri, state.x, state.y, state.width, state.height, state.platform, state.assetDir)
  await EditorWorker.invoke('Editor.loadContent', state.uid, savedState)
  const diffResult = await EditorWorker.invoke('Editor.diff2', state.uid)
  const commands = await EditorWorker.invoke('Editor.render2', state.uid, diffResult)
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
  const savedState = await EditorWorker.invoke('Editor.saveState', state.uid)
  await EditorWorker.restart('Editor.terminate')
  await EditorWorker.invoke('Editor.create', state.uid, '', state.x, state.y, state.width, state.height, null)
  await EditorWorker.invoke('Editor.loadContent', state.uid, savedState)
  const diffResult = await EditorWorker.invoke('Editor.diff2', state.uid)
  const commands = await EditorWorker.invoke('Editor.render2', state.uid, diffResult)
  state.isHotReloading = false
  return {
    ...state,
    commands,
  }
}
