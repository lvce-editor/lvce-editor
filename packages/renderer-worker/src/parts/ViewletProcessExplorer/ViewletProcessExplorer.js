import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Platform from '../Platform/Platform.js'
import * as ProcessExplorerWorker from '../ProcessExplorerWorker/ProcessExplorerWorker.js'

export const create = (id, uri, x, y, width, height, args, parentUid) => {
  return {
    uid: id,
    parentUid,
    x,
    y,
    width,
    height,
    platform: Platform.getPlatform(),
    assetDir: AssetDir.assetDir,
    commands: [],
  }
}

export const loadContent = async (state, savedState) => {
  await ProcessExplorerWorker.invoke(
    'ProcessExplorer.create',
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
  await ProcessExplorerWorker.invoke('ProcessExplorer.loadContent', state.uid, savedState)
  const diffResult = await ProcessExplorerWorker.invoke('ProcessExplorer.diff2', state.uid)
  const commands = await ProcessExplorerWorker.invoke('ProcessExplorer.render2', state.uid, diffResult)
  return {
    ...state,
    commands,
  }
}

export const dispose = () => {}

export const hotReload = async (state) => {
  if (state.isHotReloading) {
    return state
  }
  state.isHotReloading = true
  await ProcessExplorerWorker.restart('ProcessExplorer.terminate')
  await ProcessExplorerWorker.invoke(
    'ProcessExplorer.create',
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
  await ProcessExplorerWorker.invoke('ProcessExplorer.loadContent', state.uid)
  const diffResult = await ProcessExplorerWorker.invoke('ProcessExplorer.diff2', state.uid)
  const commands = await ProcessExplorerWorker.invoke('ProcessExplorer.render2', state.uid, diffResult)
  return {
    ...state,
    commands,
    isHotReloading: false,
  }
}
