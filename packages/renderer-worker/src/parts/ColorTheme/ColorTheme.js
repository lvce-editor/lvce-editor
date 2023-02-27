import * as Command from '../Command/Command.js'
import * as Css from '../Css/Css.js'
import * as Logger from '../Logger/Logger.js'
import * as Meta from '../Meta/Meta.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import { VError } from '../VError/VError.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'

// TODO by default color theme should come from local storage, session storage, cache storage, indexeddb or blob url -> fast initial load
// actual color theme can be computed after workbench has loaded (most times will be the same and doesn't need to be computed)

export const state = {
  watchedTheme: '',
}

const FALLBACK_COLOR_THEME_ID = 'slime'

const getColorThemeJsonFromSharedProcess = async (colorThemeId) => {
  // const extensions = await ExtensionMeta.getExtensions()
  // for(const extension of extensions){
  //   if(extension.status==='rejected'){
  //     continue
  //   }
  //   if(!extension.colorThemes){
  //     continue
  //   }
  //   for(const colorTheme of extension.colorThemes){
  //     if(colorTheme.id !== colorThemeId){
  //       continue
  //     }
  //     const absolutePath = `${extension.path}/${colorTheme.path}`
  //   }
  // }
  return SharedProcess.invoke(/* ExtensionHost.getColorThemeJson */ 'ExtensionHost.getColorThemeJson', /* colorThemeId */ colorThemeId)
}

const getColorThemeUrlWeb = (colorThemeId) => {
  return `/extensions/builtin.theme-${colorThemeId}/color-theme.json`
}

const getColorThemeJsonFromStaticFolder = (colorThemeId) => {
  const url = getColorThemeUrlWeb(colorThemeId)
  // TODO handle error ?
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
}

const getFallbackColorTheme = async () => {
  const assetDir = Platform.getAssetDir()
  const url = `${assetDir}/themes/fallback_theme.json`
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
}

// TODO json parsing should also happen in renderer worker
// so that all validation is here (json parsing errors, invalid shape, ...)

const getColorThemeJson = (colorThemeId) => {
  if (Platform.platform === PlatformType.Web) {
    return getColorThemeJsonFromStaticFolder(colorThemeId)
  }
  return getColorThemeJsonFromSharedProcess(colorThemeId)
}

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
    state.colorTheme = colorThemeId
    const colorThemeJson = await getColorThemeJson(colorThemeId)
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

export const reload = async () => {
  const colorThemeId = Preferences.get('workbench.colorTheme')
  await applyColorTheme(colorThemeId)
}

// TODO test this, and also the error case
// TODO have icon theme, color theme together (maybe)
export const hydrate = async () => {
  const colorThemeId = Preferences.get('workbench.colorTheme')
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
