import * as AssetDir from '../AssetDir/AssetDir.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js' // TODO use Command.execute instead
import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

// then state can be recycled by Viewlet when there is only a single ViewletExtensions instance

export const saveState = (state) => {
  const { searchValue } = state
  return {
    searchValue,
  }
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
    platform: Platform.platform,
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
  const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.render2', state.id)
  return {
    ...state,
    commands,
  }
}

export const dispose = () => {}

// TODO lazyload this

// TODO show error / warning  when installment fails / times out
export const handleInstall = async (state, id) => {
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'installing',
  )
  try {
    await ExtensionManagement.install(/* id */ id)
  } catch (error) {
    // TODO have multi send command
    await RendererProcess.invoke(
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'uninstalled',
    )
    // TODO use command.execute
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'installed',
  )
}

// TODO lazyload this
export const handleUninstall = async (state, id) => {
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'uninstalling',
  )
  try {
    await ExtensionManagement.uninstall(id)
  } catch (error) {
    await RendererProcess.invoke(
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'installed',
    )
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'uninstalled',
  )
}

// TODO lazyload this
export const handleEnable = async (state, id) => {
  try {
    await ExtensionManagement.enable(id)
  } catch (error) {
    await RendererProcess.invoke(
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'disabled',
    )
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'enabled',
  )
}

// TODO lazyload this
export const handleDisable = async (state, id) => {
  try {
    await ExtensionManagement.disable(id)
  } catch (error) {
    console.error(error)
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'disabled',
  )
}

export const openSuggest = async (state) => {
  // TODO
}

export const closeSuggest = async (state) => {
  // TODO
}

export const toggleSuggest = async (state) => {
  // TODO
}

export const handleBlur = (state) => {
  return {
    ...state,
    focused: false,
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
  const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.render2', oldState.id)
  return {
    ...oldState,
    commands,
    isHotReloading: false,
  }
}
