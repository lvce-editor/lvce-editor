import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

export const create = (id, uri, x, y, width, height) => {
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
    platform: Platform.platform,
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

export const handleFocusChange = (state, isFocused) => {
  return { ...state, isFocused }
}
