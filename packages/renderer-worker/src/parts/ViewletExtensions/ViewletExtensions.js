import * as AssetDir from '../AssetDir/AssetDir.js'
import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'
import * as Platform from '../Platform/Platform.js'
import * as UpdateExtensionSearchRenderState from '../UpdateExtensionSearchRenderState/UpdateExtensionSearchRenderState.js'

// then state can be recycled by Viewlet when there is only a single ViewletExtensions instance

export const saveState = async (state) => {
  const savedState = await ExtensionSearchViewWorker.invoke('SearchExtensions.saveState', state.id)
  return savedState
}

export const create = (id, uri, x, y, width, height, _args, parentUid) => {
  return {
    id,
    uid: id,
    searchValue: '',
    title: '',
    width,
    height,
    x,
    y,
    platform: Platform.getPlatform(),
    assetDir: AssetDir.assetDir,
    parentUid,
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
    state.parentUid,
  )

  await ExtensionSearchViewWorker.invoke('SearchExtensions.loadContent', state.id, savedState)
  const diffResult = await ExtensionSearchViewWorker.invoke('SearchExtensions.diff2', state.id)
  const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.render3', state.id, diffResult)
  const renderState = UpdateExtensionSearchRenderState.updateExtensionSearchRenderState(state, commands)
  return {
    ...renderState,
    title: renderState.title || 'Extensions: Installed',
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
    state.parentUid,
  )
  await ExtensionSearchViewWorker.invoke('SearchExtensions.loadContent', state.id, savedState)
  const diffResult = await ExtensionSearchViewWorker.invoke('SearchExtensions.diff2', state.id)
  const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.render3', oldState.id, diffResult)
  return UpdateExtensionSearchRenderState.updateExtensionSearchRenderState(
    {
      ...oldState,
      isHotReloading: false,
    },
    commands,
  )
}
