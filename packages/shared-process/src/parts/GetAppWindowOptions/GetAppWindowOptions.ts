import * as GetBrowserWindowOptions from '../GetBrowserWindowOptions/GetBrowserWindowOptions.ts'
import * as ExtensionManagementColorTheme from '../ExtensionManagement/ExtensionManagementColorTheme.ts'
import * as Platform from '../Platform/Platform.ts'

const fallbackBackground = '#1e2324'
const fallbackSymbolColor = '#74b1be'

const getColor = (colors: any, keys: any, fallback: any): any => {
  for (const key of keys) {
    if (colors[key]) {
      return colors[key]
    }
  }
  return fallback
}

const getColorThemeJson = async (preferences: any): Promise<any> => {
  const colorThemeId = preferences['workbench.colorTheme']
  if (!colorThemeId) {
    return {}
  }
  try {
    return await ExtensionManagementColorTheme.getColorThemeJson(colorThemeId)
  } catch {
    return {}
  }
}

export const getAppWindowOptions = async ({ preferences, screenWidth, screenHeight, preloadUrl }: any): Promise<any> => {
  const colorThemeJson = await getColorThemeJson(preferences)
  const colors = colorThemeJson.colors && typeof colorThemeJson.colors === 'object' ? colorThemeJson.colors : {}
  const background = getColor(colors, ['MainBackground'], fallbackBackground)
  const titleBarBackground = getColor(colors, ['TitleBarActiveBackground', 'TitleBarBackground', 'MainBackground'], fallbackBackground)
  const titleBarSymbolColor = getColor(
    colors,
    ['TitleBarForegroundActive', 'TitleBarForeground', 'TitleBarColor', 'TitleBarColorInactive'],
    fallbackSymbolColor,
  )
  const titleBarPreference = preferences['window.titleBarStyle']
  const frame = titleBarPreference !== 'custom'
  const titleBarStyle = titleBarPreference === 'custom' ? 'hidden' : undefined
  const zoomLevelPreference = preferences['window.zoomLevel']
  const zoomLevel = zoomLevelPreference
  const windowControlsOverlayPreference =
    (Platform.isWindows || Platform.isMacOs || Platform.isLinux) && preferences['window.controlsOverlay.enabled']

  const titleBarOverlay = windowControlsOverlayPreference
    ? {
        color: titleBarBackground,
        symbolColor: titleBarSymbolColor,
        height: 29,
      }
    : undefined

  return GetBrowserWindowOptions.getBrowserWindowOptions({
    y: 0,
    x: screenWidth - 800,
    width: 800,
    height: screenHeight,
    background,
    titleBarStyle,
    frame,
    titleBarOverlay,
    preloadUrl,
  })
}
