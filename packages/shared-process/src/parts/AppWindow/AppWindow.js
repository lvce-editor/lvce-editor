import * as DefaultUrl from '../DefaultUrl/DefaultUrl.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Screen from '../Screen/Screen.js'

const getWindowOptions = async (preferencs, screenWidth, screenHeight) => {
  const titleBarPreference = preferencs['window.titleBarStyle']
  const frame = titleBarPreference !== 'custom'
  const titleBarStyle = titleBarPreference === 'custom' ? 'hidden' : undefined
  const zoomLevelPreference = preferencs['window.zoomLevel']
  const zoomLevel = zoomLevelPreference
  const windowControlsOverlayPreference = Platform.isWindows && preferencs['window.controlsOverlay.enabled']

  const titleBarOverlay = windowControlsOverlayPreference
    ? {
        color: '#1e2324',
        symbolColor: '#74b1be',
        height: 29,
      }
    : undefined
  return {
    y: 0,
    x: screenWidth - 800,
    width: 800,
    height: screenHeight,
    menu: true,
    background: '#1e2324',
    titleBarStyle,
    frame,
    zoomLevel,
    titleBarOverlay,
  }
}

export const createAppWindow = async (preferences, parsedArgs, workingDirectory, url = DefaultUrl.defaultUrl) => {
  const screenWidth = await Screen.getWidth()
  const screenHeight = await Screen.getHeight()
  const windowOptions = getWindowOptions(preferences, screenWidth, screenHeight)
  return ParentIpc.invoke('Appwindow.createAppWindow2', windowOptions, parsedArgs, workingDirectory, url)
}

export const openNew = async (url) => {
  const preferences = await Preferences.getAll()
  return createAppWindow(preferences, [], '', url)
}
