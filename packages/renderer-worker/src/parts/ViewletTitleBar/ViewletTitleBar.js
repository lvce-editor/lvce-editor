import * as Platform from '../Platform/Platform.js'
import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

export const create = (id, uri, x, y, width, height) => {
  const titleBarStyleCustom = Preferences.get('window.titleBarStyle') === 'custom'
  const controlsOverlayEnabled = Preferences.get('window.controlsOverlay.enabled') === true
  return {
    uid: id,
    disposed: false,
    x,
    y,
    width,
    height,
    titleBarIconWidth: 30,
    isFocused: false,
    titleBarIconEnabled: true,
    titleBarMenuBarEnabled: true,
    titleBarButtonsEnabled: true,
    titleBarButtonsWidth: 46 * 3,
    titleBarTitleEnabled: true,
    titleBarStyleCustom,
    controlsOverlayEnabled,
    platform: Platform.getPlatform(),
    assetDir: AssetDir.assetDir,
  }
}

export const loadContent = async (state) => {
  await TitleBarWorker.invoke(
    'TitleBar.create3',
    state.uid,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    state.platform,
    state.controlsOverlayEnabled,
    state.titleBarStyleCustom,
    state.assetDir,
  )
  await TitleBarWorker.invoke(`TitleBar.loadContent2`, state.uid)
  const diffResult = await TitleBarWorker.invoke(`TitleBar.diff3`, state.uid)
  const commands = await TitleBarWorker.invoke('TitleBar.render3', state.uid, diffResult)
  const titleBarTitleEnabled = Preferences.get('titleBar.titleEnabled') ?? false
  return {
    ...state,
    commands,
    isFocused: true,
    titleBarTitleEnabled,
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
  await TitleBarWorker.restart('TitleBar.terminate')
  const oldState = {
    ...state,
    items: [],
  }
  await TitleBarWorker.invoke(
    'TitleBar.create3',
    state.uid,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    state.platform,
    state.controlsOverlayEnabled,
    state.titleBarStyleCustom,
    state.assetDir,
  )
  await TitleBarWorker.invoke(`TitleBar.loadContent2`, state.uid)
  const diffResult = await TitleBarWorker.invoke(`TitleBar.diff3`, state.uid)
  const commands = await TitleBarWorker.invoke('TitleBar.render3', state.uid, diffResult)
  return {
    ...oldState,
    commands,
    isHotReloading: false,
  }
}

export const handleFocusChange = (state, isFocused) => {
  return { ...state, isFocused }
}
