import * as Assert from '../Assert/Assert.ts'
import * as Css from '../Css/Css.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as GetColorThemeCss from '../GetColorThemeCss/GetColorThemeCss.js'
import * as GetMetaThemeColor from '../GetMetaThemeColor/GetMetaThemeColor.js'
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

// TODO json parsing should also happen in renderer worker
// so that all validation is here (json parsing errors, invalid shape, ...)

const applyColorTheme = async (colorThemeId) => {
  try {
    Assert.string(colorThemeId)
    state.colorTheme = colorThemeId
    const colorThemeCss = await GetColorThemeCss.getColorThemeCss(colorThemeId)
    if (!colorThemeCss) {
      return new Error(`Color theme is empty`)
    }
    await Css.addCssStyleSheet('ContributedColorTheme', colorThemeCss)
    if (Platform.getPlatform() === PlatformType.Web) {
      const themeColor = GetMetaThemeColor.getMetaThemeColor(colorThemeId) || ''
      await Meta.setThemeColor(themeColor)
    }
    if (Platform.getPlatform() !== PlatformType.Web && Preferences.get('development.watchColorTheme')) {
      watch(colorThemeId)
    }
    return undefined
  } catch (error) {
    return new VError(error, `Failed to apply color theme "${colorThemeId}"`)
  }
}

export const setColorTheme = async (colorThemeId) => {
  const error = await applyColorTheme(colorThemeId)
  if (error) {
    return error
  }
  // TODO should preferences throw errors or should it call handleError directly?
  await Preferences.set('workbench.colorTheme', colorThemeId)
  return undefined
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
