import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as Css from '../Css/Css.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as GetColorThemeJson from '../GetColorThemeJson/GetColorThemeJson.js'
import * as Meta from '../Meta/Meta.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import { VError } from '../VError/VError.js'
// TODO by default color theme should come from local storage, session storage, cache storage, indexeddb or blob url -> fast initial load
// actual color theme can be computed after workbench has loaded (most times will be the same and doesn't need to be computed)

export const state = {
  watchedTheme: '',
}

const FALLBACK_COLOR_THEME_ID = 'slime'

const getFallbackColorTheme = async () => {
  const assetDir = Platform.getAssetDir()
  const url = `${assetDir}/themes/fallback_theme.json`
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
}

// TODO json parsing should also happen in renderer worker
// so that all validation is here (json parsing errors, invalid shape, ...)

export const getColorThemeCss = async (colorThemeId, colorThemeJson) => {
  const colorThemeCss = await Command.execute(
    /* ColorThemeFromJson.createColorThemeFromJson */ 'ColorThemeFromJson.createColorThemeFromJson',
    /* colorThemeId */ colorThemeId,
    /* colorThemeJson */ colorThemeJson
  )
  return colorThemeCss
  // TODO generate color theme from jsonc
}

const getMetaThemeColor = (colorThemeJson) => {
  return colorThemeJson && colorThemeJson.colors && colorThemeJson.colors.TitleBarBackground
}
const applyColorTheme = async (colorThemeId) => {
  try {
    Assert.string(colorThemeId)
    state.colorTheme = colorThemeId
    const colorThemeJson = await GetColorThemeJson.getColorThemeJson(colorThemeId)
    const colorThemeCss = await getColorThemeCss(colorThemeId, colorThemeJson)
    await Css.setInlineStyle('ContributedColorTheme', colorThemeCss)
    if (Platform.platform === PlatformType.Web) {
      const themeColor = getMetaThemeColor(colorThemeJson) || ''
      await Meta.setThemeColor(themeColor)
    }
    if (Platform.platform !== PlatformType.Web && Preferences.get('development.watchColorTheme')) {
      watch(colorThemeId)
    }
  } catch (error) {
    throw new VError(error, `Failed to apply color theme "${colorThemeId}"`)
  }
}

export const setColorTheme = async (colorThemeId) => {
  await applyColorTheme(colorThemeId)
  // TODO should preferences throw errors or should it call handleError directly?
  await Preferences.set('workbench.colorTheme', colorThemeId)
}

export const watch = async (id) => {
  if (state.watchedTheme === id) {
    return
  }
  state.watchedTheme = id
  await SharedProcess.invoke('ExtensionHost.watchColorTheme', id)
}

const getPreferredColorTheme = () => {
  const preferredColorTheme = Preferences.get('workbench.colorTheme')
  return preferredColorTheme
}

export const reload = async () => {
  const colorThemeId = getPreferredColorTheme()
  await applyColorTheme(colorThemeId)
}

// TODO test this, and also the error case
// TODO have icon theme, color theme together (maybe)
export const hydrate = async () => {
  const preferredColorTheme = getPreferredColorTheme()
  const colorThemeId = preferredColorTheme || FALLBACK_COLOR_THEME_ID
  try {
    await applyColorTheme(colorThemeId)
  } catch (error) {
    if (colorThemeId === FALLBACK_COLOR_THEME_ID) {
      throw error
    }
    ErrorHandling.handleError(error)
    await applyColorTheme(FALLBACK_COLOR_THEME_ID)
  }
}
