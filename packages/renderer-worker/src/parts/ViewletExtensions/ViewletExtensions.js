import * as AssetDir from '../AssetDir/AssetDir.js'
import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'
import * as Platform from '../Platform/Platform.js'

// then state can be recycled by Viewlet when there is only a single ViewletExtensions instance

export const saveState = async (state) => {
  const savedState = await ExtensionSearchViewWorker.invoke('SearchExtensions.saveState', state.id)
  return savedState
}

export const create = (id, uri, x, y, width, height) => {
  return {
    id,
    uid: id,
    searchValue: '',
    width,
    height,
    x,
    y,
    platform: Platform.getPlatform(),
    assetDir: AssetDir.assetDir,
  }
}

export const loadContent = async (state, savedState) => {
  await ExtensionSearchViewWorker.invoke(
    'SearchExtensions.create',
    state.id,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    state.platform,
    state.assetDir,
  )

  await ExtensionSearchViewWorker.invoke('SearchExtensions.loadContent', state.id, savedState)
  const diffResult = await ExtensionSearchViewWorker.invoke('SearchExtensions.diff2', state.id)
  const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.render3', state.id, diffResult)
  return {
    ...state,
    commands,
  }
}

export const dispose = () => {}

// TODO lazyload this

export const hotReload = async (state) => {
  if (state.isHotReloading) {
    return state
  }
  // TODO avoid mutation
  state.isHotReloading = true
  // possible TODO race condition during hot reload
  // there could still be pending promises when the worker is disposed
  const savedState = await ExtensionSearchViewWorker.invoke('SearchExtensions.saveState', state.uid)
  await ExtensionSearchViewWorker.restart('SearchExtensions.terminate')
  const oldState = {
    ...state,
    items: [],
  }
  await ExtensionSearchViewWorker.invoke(
    'SearchExtensions.create',
    state.id,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    state.platform,
    state.assetDir,
  )
  await ExtensionSearchViewWorker.invoke('SearchExtensions.loadContent', state.id, savedState)
  const diffResult = await ExtensionSearchViewWorker.invoke('SearchExtensions.diff2', state.id)
  const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.render3', oldState.id, diffResult)
  return {
    ...oldState,
    commands,
    isHotReloading: false,
  }
}
