import * as DiffViewWorker from '../DiffViewWorker/DiffViewWorker.js'
import * as Platform from '../Platform/Platform.js'
import * as AssetDir from '../AssetDir/AssetDir.js'

export const create = (uid, uri, x, y, width, height, args, parentUid) => {
  return {
    id: uid,
    uid,
    parentUid,
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

export const loadContent = async (state, savedState) => {
  await DiffViewWorker.invoke(
    'DiffView.create',
    state.uid,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    null,
    state.platform,
    state.assetDir,
  )
  await DiffViewWorker.invoke('DiffView.loadContent', state.uid, savedState)
  const diffResult = await DiffViewWorker.invoke('DiffView.diff2', state.uid)
  const commands = await DiffViewWorker.invoke('DiffView.render2', state.uid, diffResult)
  return {
    ...state,
    commands,
  }
}

export const hotReload = async (state) => {
  if (state.isHotReloading) {
    return state
  }
  state.isHotReloading = true
  const savedState = await DiffViewWorker.invoke('DiffView.saveState', state.uid)
  await DiffViewWorker.restart('DiffView.terminate')
  await DiffViewWorker.invoke(
    'DiffView.create',
    state.uid,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    null,
    null,
    state.platform,
    state.assetDir,
  )
  await DiffViewWorker.invoke('DiffView.loadContent', state.uid, savedState)
  const diffResult = await DiffViewWorker.invoke('DiffView.diff2', state.uid)
  const commands = await DiffViewWorker.invoke('DiffView.render2', state.uid, diffResult)
  state.isHotReloading = false
  return {
    ...state,
    commands,
  }
}
