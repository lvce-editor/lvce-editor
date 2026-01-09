import * as GetBrowserWindowOptions from '../GetBrowserWindowOptions/GetBrowserWindowOptions.js'
import * as Platform from '../Platform/Platform.js'

export const getAppWindowOptions = ({ preferences, screenWidth, screenHeight, preloadUrl }) => {
  const titleBarPreference = preferences['window.titleBarStyle']
  const frame = titleBarPreference !== 'custom'
  const titleBarStyle = titleBarPreference === 'custom' ? 'hidden' : undefined
  const zoomLevelPreference = preferences['window.zoomLevel']
  const zoomLevel = zoomLevelPreference
  const windowControlsOverlayPreference =
    (Platform.isWindows || Platform.isMacOs || Platform.isLinux) && preferences['window.controlsOverlay.enabled']

  const titleBarOverlay = windowControlsOverlayPreference
    ? {
        color: '#1e2324',
        symbolColor: '#74b1be',
        height: 29,
      }
    : undefined

  return GetBrowserWindowOptions.getBrowserWindowOptions({
    y: 0,
    x: screenWidth - 800,
    width: 800,
    height: screenHeight,
    background: '#1e2324',
    titleBarStyle,
    frame,
    titleBarOverlay,
    preloadUrl,
  })
}
